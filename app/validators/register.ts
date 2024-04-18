import vine from '@vinejs/vine'

export const RegisterValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(3).maxLength(20).optional(),
    phone: vine
      .string()
      .unique(async (db, value) => {
        const user = await db.from('users').where('phone', value).first()
        return !user
      })
      .mobile({
        locale: ['ar-EG'],
        strictMode: true,
      }),
    password: vine
      .string()
      .minLength(8)
      .maxLength(16)
      .alphaNumeric({
        allowUnderscores: true,
      })
      .confirmed({
        confirmationField: 'passwordConfirmation',
      }),
  })
)
