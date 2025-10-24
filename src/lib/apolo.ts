import { ApolloServer } from '@apollo/server';
import {
	fastifyApolloDrainPlugin,
	fastifyApolloHandler,
} from '@as-integrations/fastify';
import { buildSchema } from 'drizzle-graphql';
import type { FastifyInstance } from 'fastify';
import { db } from '@/db/client';

export async function apolloServer(app: FastifyInstance) {
	const { schema } = buildSchema(db);

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
