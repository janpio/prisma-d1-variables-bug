import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export interface Env {
	DB: D1Database
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const adapter = new PrismaD1(env.DB)
		const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'], })

		/*
		let users = await loadUsers(prisma)
		if (!users.length) {
			await createUsers(prisma);
			users = await loadUsers(prisma);
		}
		*/

		const posts = await createPosts(prisma);
		
		const users = await prisma.user.create({
			data: {
				name: "Foo",
				email: "foo@bar.org",
				posts: {
					connect: posts.map((post) => ({ id: post.id })),
				},
			},
			include: {
				posts: true
			}
		});

		const result = JSON.stringify(users)
		return new Response(result);
	},
};

async function loadUsers(prisma: PrismaClient) {
	return await prisma.user.findMany({
		include: {
			posts: true,
		},
	});
}

async function createUsers(prisma: PrismaClient) {
	for (let i = 0; i < 250; i++) {
		await prisma.user.create({
			data: {
				email: `user${i}@example.com`,
				name: `User ${i}`,
				posts: {
					createMany: {
						data: [
							{
								title: `Post ${i}`,
								content: `This is the content of post ${i} by User ${i}`,
							},
							{
								title: `Post ${i}b`,
								content: `This is the content of the second post ${i}b by User ${i}`,
							},
						],
					},
				},
			},
		});
	}
}

async function createPosts(prisma: PrismaClient) {
	const posts = []
	for (let i = 0; i < 250; i++) {
		posts.push(await prisma.post.create({
			data: 
				{
					title: `Post ${i}`,
					content: `This is the content of post ${i} by User ${i}`,
				},

		}))
	}
	return posts
}