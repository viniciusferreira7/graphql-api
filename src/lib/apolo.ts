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
} from 'graphql';
import { db } from '@/db/client';
import { schema as dbSchema } from '@/db/schema';

export async function apolloServer(app: FastifyInstance) {
	const { entities } = buildSchema(db);

	const schema = new GraphQLSchema({
		query: new GraphQLObjectType({
			name: 'Query',
			fields: {
				users: {
					type: new GraphQLList(new GraphQLNonNull(entities.types.UsersItem)),
					args: {
						where: {
							type: entities.inputs.UsersFilters,
						},
					},
					resolve: async (source, args, context, info) => {
						console.log({ source, args, context, info });
						const result = await db
							.select({
								name: dbSchema.users.name,
							})
							.from(dbSchema.users);

						return result;
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
