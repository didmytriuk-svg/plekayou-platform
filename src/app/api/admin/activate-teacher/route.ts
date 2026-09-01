import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { email, password, teacherId } = await request.json()

    if (!email || !password || !teacherId) {
      return NextResponse.json({ error: 'Відсутні обов’язкові поля' }, { status: 400 })
    }

    // Створюємо серверний клієнт з підвищеними правами (Service Role)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    )

    // 1. Перевіряємо, чи існує вже користувач в Auth
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId = existingUser?.id

    if (!userId) {
      // 2. Якщо немає — створюємо нового з підтвердженим email та заданим паролем
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }
      userId = createData.user.id
    } else {
      // 3. Якщо існує — оновлюємо йому пароль на щойно згенерований
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
      })

      if (updateAuthError) {
        return NextResponse.json({ error: updateAuthError.message }, { status: 400 })
      }
    }

    // 4. Оновлюємо таблицю волонтерів, прив'язуючи user_id, статус та пароль
    const { error: dbError } = await supabaseAdmin
      .from('volunteer_applications')
      .update({
        user_id: userId,
        status: 'active_cabinet',
        temp_password: password
      })
      .eq('id', teacherId)

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, userId })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Помилка сервера' }, { status: 500 })
  }
}