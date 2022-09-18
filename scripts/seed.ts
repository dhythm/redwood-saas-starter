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

    const organizations = await Promise.all(
      [
        {
          organizationCode: '0001',
          name: 'organization1',
        },
        {
          organizationCode: '0002',
          name: 'organization2',
        },
      ].map(({ organizationCode, name }) =>
        db.organization.upsert({
          where: {
            organizationCode,
          },
          create: {
            organizationCode,
            name,
          },
          update: {},
        })
      )
    )
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

    await Promise.all(
      organizations.map(({ organizationCode }) =>
        db.role.upsert({
          where: {
            organizationCode_name: {
              organizationCode,
              name: 'viewer',
            },
          },
          create: {
            organizationCode,
            name: 'viewer',
            abilities: {
              connect: queryAbilities,
            },
          },
          update: {},
        })
      )
    )
    const adminRoles = await Promise.all(
      organizations.map(({ organizationCode }) =>
        db.role.upsert({
          where: {
            organizationCode_name: {
              organizationCode,
              name: 'admin',
            },
          },
          create: {
            organizationCode,
            name: 'admin',
            abilities: {
              connect: mutateAbilities,
            },
          },
          update: {},
        })
      )
    )
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
          connect: adminRoles.map(({ id }) => ({ id })),
        },
        organizations: {
          connect: organizations.map(({ id }) => ({ id })),
        },
      },
      update: {},
    })
    logger.debug({ data: {} }, 'Created users')
  } catch (error) {
    logger.error(error)
  }
}
