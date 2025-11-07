import { ApolloServer } from '@apollo/server';
import {
	fastifyApolloDrainPlugin,
	fastifyApolloHandler,
} from '@as-integrations/fastify';
import { buildSchema } from 'drizzle-graphql';
import type { FastifyInstance } from 'fastify';
import {
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from 'graphql';
import { db } from '@/db/client';
import { schema as dbSchema } from '@/db/schema';

export async function apolloServer(app: FastifyInstance) {
	const { entities } = buildSchema(db);

	const sabeUserType = new GraphQLObjectType({
		name: 'SafeUser',
		fields: {
			id: { type: new GraphQLNonNull(GraphQLString) },
			name: { type: new GraphQLNonNull(GraphQLString) },
			email: { type: new GraphQLNonNull(GraphQLString) },
			createdAt: { type: new GraphQLNonNull(GraphQLString) },
			updatedAt: { type: new GraphQLNonNull(GraphQLString) },
		},
	});

	const schema = new GraphQLSchema({
		query: new GraphQLObjectType({
			name: 'Query',
			fields: {
				users: {
					type: new GraphQLList(sabeUserType),
					args: {
						where: {
							type: entities.inputs.UsersFilters,
						},
					},
					resolve: async (_source, _args, _context, _info) => {
						const users = await db
							.select({
								id: dbSchema.users.id,
								name: dbSchema.users.name,
								email: dbSchema.users.email,
								createdAt: dbSchema.users.createdAt,
								updatedAt: dbSchema.users.updatedAt,
							})
							.from(dbSchema.users);

						return users;
					},
				},
			},
		}),
	});

	const apollo = new ApolloServer({
		schema,
		plugins: [fastifyApolloDrainPlugin(app)],
	});
	await apollo.start();

	app.route({
		url: '/graphql',
		method: ['POST', 'GET', 'OPTIONS'],
		handler: fastifyApolloHandler(apollo),
	});
}
