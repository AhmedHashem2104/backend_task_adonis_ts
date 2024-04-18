import Content from '#models/content'
import { AddContentValidator } from '#validators/add_content'
import { UpdateContentValidator } from '#validators/update_content'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { unlink } from 'fs'

export default class ContentsController {
  async index({ response, auth }: HttpContext) {
    const result = await Content.query().where('user_id', auth.user?.id!)
    if (!result.length)
      return response.status(400).json({
        message: `No data found`,
      })

    return response.json(result)
  }

  async show({ response, auth, params }: HttpContext) {
    const result = await Content.query()
      .where('user_id', auth.user?.id!)
      .where('id', params.id)
      .first()

    if (!result)
      return response.status(400).json({
        message: `Content does not exists`,
      })

    if (result?.user_id !== auth.user?.id)
      return response.status(400).json({
        message: `Not allowed access`,
      })

    return response.json(result)
  }

  async store({ response, request, auth }: HttpContext) {
    const data = await request.validateUsing(AddContentValidator)

    await data.media.move(app.makePath(`uploads`), {
      name: `${cuid()}.${data.media.extname}`,
    })

    const result = await Content.create({
      name: data.name,
      media: data.media.fileName,
      user_id: auth.user?.id!,
    })

    return response.json(result)
  }

  async update({ response, request, params, auth }: HttpContext) {
    const data = await request.validateUsing(UpdateContentValidator)

    const content = await Content.query()
      .where(`id`, params.id)
      .where(`user_id`, auth.user?.id!)
      .first()

    if (!content)
      return response.status(400).json({
        message: `Content does not exists`,
      })

    if (data.media) {
      await data.media.move(app.makePath(`uploads`), {
        name: `${cuid()}.${data.media.extname}`,
      })
    }

    await Content.query().where(`id`, params.id).where(`user_id`, auth.user?.id!).update({
      name: data.name,
      media: data?.media?.fileName,
    })

    return response.json({
      message: `Content updated`,
    })
  }

  async destroy({ response, auth, params }: HttpContext) {
    const result = await Content.query()
      .where('user_id', auth.user?.id!)
      .where('id', params.id)
      .first()

    if (!result)
      return response.status(400).json({
        message: `Content does not exists`,
      })

    if (result?.user_id !== auth.user?.id)
      return response.status(400).json({
        message: `Not allowed access`,
      })

    await result.delete().then(() => {
      unlink(`./uploads/${result.media}`, () => {})
    })

    return response.json({
      message: `Content deleted`,
    })
  }
}
