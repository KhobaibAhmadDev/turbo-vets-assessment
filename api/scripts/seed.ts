import { DataSource } from 'typeorm';
import { Task, User, Organization } from '@myorg/data';

async function seed() {
  const ds = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'P@ssw0rd4132',
    database: 'turbovets',
    entities: [Task, User, Organization],
    synchronize: true,
  });

  await ds.initialize();

  const orgRepo = ds.getRepository(Organization);
  const userRepo = ds.getRepository(User);

  let org = await orgRepo.findOneBy({ name: 'Acme Org' } as any);
  if (!org) {
    org = orgRepo.create({ name: 'Acme Org' } as any);
    await orgRepo.save(org);
  }

  let user = await userRepo.findOne({ where: { email: 'owner@example.com' } as any });
  if (!user) {
    user = userRepo.create({
      email: 'owner@example.com',
      password: 'password123',
      role: 'OWNER',
      organization: org,
    } as any);
    await userRepo.save(user);
  }

  console.log('Seed complete. Credentials: owner@example.com / password123');
  await ds.destroy();
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
