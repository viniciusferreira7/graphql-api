import { faker } from '@faker-js/faker';
import { db } from './client';
import { schema } from './schema';

const USERS_COUNT = 10;
const PETS_PER_USER = 2;

async function seed() {
	console.log('🌱 Starting database seed...');

	try {
		console.log('🗑️  Clearing existing data...');
		await db.delete(schema.pets);
		await db.delete(schema.users);

		console.log(`👥 Creating ${USERS_COUNT} users...`);
		const userRecords = [];

		for (let i = 0; i < USERS_COUNT; i++) {
			userRecords.push({
				name: faker.person.fullName(),
				email: faker.internet.email().toLowerCase(),
			});
		}

		const insertedUsers = await db
			.insert(schema.users)
			.values(userRecords)
			.returning();
		console.log(`✅ Created ${insertedUsers.length} users`);

		console.log(`🐾 Creating pets for users...`);
		const petRecords = [];
		const petTypes = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish'];

		for (const user of insertedUsers) {
			const petsCount = faker.number.int({ min: 1, max: PETS_PER_USER });

			for (let i = 0; i < petsCount; i++) {
				const petType = faker.helpers.arrayElement(petTypes);
				let breed: string | undefined;

				if (petType === 'dog') {
					breed = faker.animal.dog();
				} else if (petType === 'cat') {
					breed = faker.animal.cat();
				} else if (petType === 'bird') {
					breed = faker.animal.bird();
				} else if (petType === 'fish') {
					breed = faker.animal.fish();
				}

				petRecords.push({
					name: faker.person.firstName(),
					type: petType,
					breed: breed,
					ownerId: user.id,
				});
			}
		}

		const insertedPets = await db
			.insert(schema.pets)
			.values(petRecords)
			.returning();
		console.log(`✅ Created ${insertedPets.length} pets`);

		console.log('✨ Database seeded successfully!');
		console.log(
			`📊 Summary: ${insertedUsers.length} users, ${insertedPets.length} pets`
		);
	} catch (error) {
		console.error('❌ Error seeding database:', error);
		throw error;
	} finally {
		process.exit(0);
	}
}

seed();
