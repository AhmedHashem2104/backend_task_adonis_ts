import vine from '@vinejs/vine'

export const UpdateContentValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(20).optional(),
    media: vine
      .file({
        size: 500000,
        extnames: ['png', 'svg', 'jpg', 'jpeg', 'mp4', 'mp3'],
      })
      .optional(),
  })
)
