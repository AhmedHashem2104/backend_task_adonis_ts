import User from '#models/user'
import { RegisterValidator } from '#validators/register'
import { UpdateUserValidator } from '#validators/update_user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async register({ response, request }: HttpContext) {
    const { fullName, phone, password } = await RegisterValidator.validate(request.all())
    const result = await User.create({
      fullName,
      phone,
      password,
    })
    return response.json(result)
  }

  async login({ response, request }: HttpContext) {
    const { phone, password } = request.body()
    const user = await User.verifyCredentials(phone, password)
    const token = await User.accessTokens.create(user)
    return response.json(token)
  }

  async auth({ response, auth }: HttpContext) {
    return response.json(auth.user)
  }

  async logout({ response, auth }: HttpContext) {
    const user: any = auth.user
    const result = await User.accessTokens.delete(user, user?.currentAccessToken.identifier)
    return response.json(result)
  }

  async updateUser({ response, request, auth }: HttpContext) {
    const { fullName, password } = await UpdateUserValidator.validate(request.all())
    const result = await User.query()
      .where(`id`, auth.user?.id!)
      .update({
        fullName,
        password: (password && (await hash.make(password))) || auth.user?.password,
      })
    return response.json(result)
  }
}
