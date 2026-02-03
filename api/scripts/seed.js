const { Client } = require('pg');
const { randomUUID } = require('crypto');

async function seed() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'P@ssw0rd4132',
    database: 'turbovets',
  });

  await client.connect();

  try {
    const orgName = 'Acme Org';
    let res = await client.query('SELECT id FROM organization WHERE name = $1', [orgName]);
    let orgId;
    if (res.rows.length === 0) {
      orgId = randomUUID();
      await client.query('INSERT INTO organization(id, name) VALUES($1, $2)', [orgId, orgName]);
      console.log('Created organization', orgName);
    } else {
      orgId = res.rows[0].id;
      console.log('Found organization', orgName, orgId);
    }

    const email = 'owner@example.com';
    res = await client.query('SELECT id FROM "user" WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      const userId = randomUUID();
      const password = 'password123';
      const role = 'OWNER';
      await client.query(
        'INSERT INTO "user"(id, email, password, role, "organizationId") VALUES($1, $2, $3, $4, $5)',
        [userId, email, password, role, orgId]
      );
      console.log('Created user', email);
    } else {
      console.log('Found user', email);
    }

    console.log('Seed complete. Use:', email, '/ password123');
  } catch (err) {
    console.error('Seeding failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seed();
