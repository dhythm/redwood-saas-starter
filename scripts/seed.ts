import { Action, Domain } from '@prisma/client'
import { db } from 'api/src/lib/db'
import { logger } from 'api/src/lib/logger'

import { hashPassword } from '@redwoodjs/api'

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
  } catch (error) {
    logger.error(error)
  }
}
