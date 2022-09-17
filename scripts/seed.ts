import { Action, Domain } from '@prisma/client'
import { db } from 'api/src/lib/db'
import { logger } from 'api/src/lib/logger'

import { hashPassword } from '@redwoodjs/api'
// import CryptoJS from 'crypto-js'

export default async () => {
  try {
    const promises: any[] = []
    for (const domain of Object.keys(Domain) as (keyof typeof Domain)[]) {
      for (const action of Object.keys(Action) as (keyof typeof Action)[]) {
        const name = `${domain}${
          action.charAt(0).toUpperCase() + action.slice(1)
        }`
        if (!(await db.ability.findUnique({ where: { name } }))) {
          promises.push(
            db.ability.create({
              data: {
                name,
                domain,
                action,
              },
            })
          )
        }
      }
    }
    await Promise.allSettled(promises)
    logger.debug({ data: {} }, 'Created abilities')

    const organization = await db.organization.upsert({
      where: {
        organizationCode: '0000',
      },
      create: {
        organizationCode: '0000',
        name: 'sample organization',
      },
      update: {},
    })
    logger.debug({ data: {} }, 'Created organizations')

    const queryAbilities = await db.ability.findMany({
      where: {
        action: 'query',
      },
      select: {
        id: true,
      },
    })
    const mutateAbilities = await db.ability.findMany({
      where: {
        action: 'mutate',
      },
      select: {
        id: true,
      },
    })

    await db.role.upsert({
      where: {
        organizationCode_name: {
          organizationCode: '0000',
          name: 'viewer',
        },
      },
      create: {
        organizationCode: '0000',
        name: 'viewer',
        abilities: {
          connect: queryAbilities,
        },
      },
      update: {},
    })
    const adminRole = await db.role.upsert({
      where: {
        organizationCode_name: {
          organizationCode: '0000',
          name: 'admin',
        },
      },
      create: {
        organizationCode: '0000',
        name: 'admin',
        abilities: {
          connect: mutateAbilities,
        },
      },
      update: {},
    })
    logger.debug({ data: {} }, 'Created roles')

    const [hashedPassword, salt] = hashPassword('twixrox')
    await db.user.upsert({
      where: {
        email: 'kody@test.redwoodjs.com',
      },
      create: {
        name: 'kody',
        email: 'kody@test.redwoodjs.com',
        hashedPassword,
        salt,
        roles: {
          connect: {
            id: adminRole.id,
          },
        },
        organizations: {
          connect: {
            id: organization.id,
          },
        },
      },
      update: {},
    })
    logger.debug({ data: {} }, 'Created users')

    // If using dbAuth and seeding users, you'll need to add a `hashedPassword`
    // and associated `salt` to their record. Here's how to create them using
    // the same algorithm that dbAuth uses internally:
    //
    //   import { hashPassword } from '@redwoodjs/api'
    //
    //   const users = [
    //     { name: 'john', email: 'john@example.com', password: 'secret1' },
    //     { name: 'jane', email: 'jane@example.com', password: 'secret2' }
    //   ]
    //
    //   for (user of users) {
    //     const [hashedPassword, salt] = hashPassword(user.password)
    //     await db.user.create({
    //       data: {
    //         name: user.name,
    //         email: user.email,
    //         hashedPassword,
    //         salt
    //       }
    //     })
    //   }
  } catch (error) {
    logger.error(error)
  }
}

// https://github.com/redwoodjs/redwood/issues/5793
// https://github.com/redwoodjs/redwood/blob/main/packages/api/src/functions/dbAuth/DbAuthHandler.ts#L1288
// const _hashPassword = (text: string, salt?: string) => {
//   const useSalt = salt || CryptoJS.lib.WordArray.random(128 / 8).toString()

//   return [
//     CryptoJS.PBKDF2(text, useSalt, { keySize: 256 / 32 }).toString(),
//     useSalt,
//   ]
// }
