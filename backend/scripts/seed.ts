import dotenv from 'dotenv';
dotenv.config();
import 'module-alias/register';
import bcrypt from 'bcrypt';
import { db } from '../models/index';

async function cleanDatabase(): Promise<void> {
  console.log('🧹 Cleaning existing database records for fresh seed...');
  const dialect = db.sequelize.getDialect();

  if (dialect === 'mysql') {
    try {
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    } catch (e: any) {
      console.warn('Could not disable foreign key checks:', e.message);
    }
  }

  if (dialect === 'postgres') {
    try {
      await db.sequelize.query(`
        TRUNCATE TABLE 
          consultations,
          "commentsLikes",
          blogcomments,
          favorites,
          "BlogsLikes",
          blogs,
          testimonials,
          payment_transactions,
          payments,
          service_files_uploaded,
          request_service,
          problems,
          services,
          categories,
          attorneys,
          notifications,
          "connectedUsers",
          available_slots,
          tokens,
          files,
          users
        RESTART IDENTITY CASCADE;
      `);
      console.log('  ✓ All PostgreSQL tables truncated and sequences restarted (CASCADE)');
      console.log('✨ Database cleaned successfully.');
      return;
    } catch (pgErr: any) {
      console.warn('PostgreSQL TRUNCATE CASCADE query failed, falling back to model-by-model deletion:', pgErr.message);
    }
  }

  // Deletion order from child tables to parent tables
  const modelsInOrder = [
    { name: 'Consultation', model: db.Consultation },
    { name: 'commentsLikes', model: db.commentsLikes },
    { name: 'blogcomments', model: db.blogcomments },
    { name: 'favorites', model: db.favorites },
    { name: 'like', model: db.like },
    { name: 'blogs', model: db.blogs },
    { name: 'testimonials', model: db.testimonials },
    { name: 'payment_transactions', model: db.payment_transactions },
    { name: 'payments', model: db.payments },
    { name: 'service_files_uploaded', model: db.service_files_uploaded },
    { name: 'request_service', model: db.request_service },
    { name: 'problems', model: db.problems },
    { name: 'services', model: db.services },
    { name: 'categories', model: db.categories },
    { name: 'attorneys', model: db.attorneys },
    { name: 'notifications', model: db.notifications },
    { name: 'connectedUsers', model: db.connectedUsers },
    { name: 'AvailableSlot', model: db.AvailableSlot },
    { name: 'tokens', model: db.tokens },
    { name: 'files', model: db.files },
    { name: 'users', model: db.users },
  ];

  for (const { name, model } of modelsInOrder) {
    if (model && typeof (model as any).destroy === 'function') {
      try {
        await (model as any).destroy({ where: {}, force: true });
        console.log(`  ✓ Cleared ${name}`);
      } catch (err: any) {
        console.warn(`  ⚠️ Could not destroy records from ${name}:`, err.message);
      }
    }
  }

  if (dialect === 'mysql') {
    try {
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (e: any) {
      console.warn('Could not re-enable foreign key checks:', e.message);
    }
  }

  console.log('✨ Database cleaned successfully.');
}

async function ensureSchema(): Promise<void> {
  const dialect = db.sequelize.getDialect();
  console.log(`🔧 Ensuring schema columns exist in database (${dialect})...`);

  if (dialect === 'postgres') {
    const alterQueries = [
      'ALTER TABLE attorneys ADD COLUMN IF NOT EXISTS file_id VARCHAR(255);',
      'ALTER TABLE services ADD COLUMN IF NOT EXISTS file_id VARCHAR(255);',
      'ALTER TABLE blogs ADD COLUMN IF NOT EXISTS file_id VARCHAR(255);',
      'ALTER TABLE blogs ADD COLUMN IF NOT EXISTS "rejectionReason" VARCHAR(255);',
      'ALTER TABLE service_files_uploaded ADD COLUMN IF NOT EXISTS file_id VARCHAR(255);',
      'ALTER TABLE service_files_uploaded ADD COLUMN IF NOT EXISTS rejection_reason TEXT;',
      'ALTER TABLE consultations ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(255);',
    ];
    for (const q of alterQueries) {
      try {
        await db.sequelize.query(q);
        console.log(`  ✓ Executed: ${q}`);
      } catch (err: any) {
        console.warn(`  ⚠️ Query "${q}":`, err.message);
      }
    }
  } else if (dialect === 'mysql') {
    const tables = ['attorneys', 'services', 'blogs', 'service_files_uploaded'];
    for (const tbl of tables) {
      try {
        const [results]: any = await db.sequelize.query(
          `SHOW COLUMNS FROM \`${tbl}\` LIKE 'file_id';`
        );
        if (!results || results.length === 0) {
          await db.sequelize.query(
            `ALTER TABLE \`${tbl}\` ADD COLUMN \`file_id\` VARCHAR(255) NULL;`
          );
          console.log(`  ✓ Added file_id column to ${tbl}`);
        }
      } catch (err: any) {
        console.warn(`  ⚠️ Could not check/add file_id to ${tbl}:`, err.message);
      }
    }
  }

  try {
    await db.sequelize.sync({ alter: true });
    console.log('  ✓ Schema synchronized with alter: true.');
  } catch (err: any) {
    console.warn('  ⚠️ db.sequelize.sync({ alter: true }) warning:', err.message);
  }
}

export async function seedDatabase(options: { exitOnFinish?: boolean } = { exitOnFinish: true }): Promise<void> {
  const exitOnFinish = options.exitOnFinish ?? true;
  try {
    await db.sequelize.authenticate();
    console.log('🔌 Connected to database successfully.');

    await ensureSchema();

    await cleanDatabase();

    console.log('🌱 Seeding fresh data...');

    // 1. Users
    const hashedPassword = await bcrypt.hash('password!', 10);

    const admin = await db.users.create({
      name: 'Super',
      surname: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      phone_number: '+213 6 12 34 56 78',
      pays: 'Algérie',
      ville: 'Alger',
      age: 40,
      sex: 'Homme',
      terms_accepted: true,
      type: 'admin',
    });

    const attorneyUser1 = await db.users.create({
      name: 'Sarah',
      surname: 'Jenkins',
      email: 'sarah.jenkins@lawfirm.com',
      password: hashedPassword,
      phone_number: '+213 6 12 34 56 78',
      pays: 'Algérie',
      ville: 'Alger',
      age: 36,
      sex: 'Femme',
      terms_accepted: true,
      type: 'attorney',
    });

    const attorneyUser2 = await db.users.create({
      name: 'Alexandre',
      surname: 'Mercier',
      email: 'alexandre.mercier@lawfirm.com',
      password: hashedPassword,
      phone_number: '+213 6 98 76 54 32',
      pays: 'Algérie',
      ville: 'Lyon',
      age: 42,
      sex: 'Homme',
      terms_accepted: true,
      type: 'attorney',
    });

    const attorneyUser3 = await db.users.create({
      name: 'Elena',
      surname: 'Rostova',
      email: 'elena.rostova@lawfirm.com',
      password: hashedPassword,
      phone_number: '+213 6 55 44 33 22',
      pays: 'Algérie',
      ville: 'Marseille',
      age: 38,
      sex: 'Femme',
      terms_accepted: true,
      type: 'attorney',
    });

    const clientUser1 = await db.users.create({
      name: 'Claire',
      surname: 'Dubois',
      email: 'claire.dubois@gmail.com',
      password: hashedPassword,
      phone_number: '+213 6 11 22 33 44',
      pays: 'Algérie',
      ville: 'Bordeaux',
      age: 32,
      sex: 'Femme',
      terms_accepted: true,
      type: 'client',
    });

    const clientUser2 = await db.users.create({
      name: 'Marc',
      surname: 'Laurent',
      email: 'marc.laurent@gmail.com',
      password: hashedPassword,
      phone_number: '+213 6 22 33 44 55',
      pays: 'Algérie',
      ville: 'Nantes',
      age: 45,
      sex: 'Homme',
      terms_accepted: true,
      type: 'client',
    });

    const clientUser3 = await db.users.create({
      name: 'Sophie',
      surname: 'Bernard',
      email: 'sophie.bernard@gmail.com',
      password: hashedPassword,
      phone_number: '+213 6 33 44 55 66',
      pays: 'Algérie',
      ville: 'Toulouse',
      age: 29,
      sex: 'Femme',
      terms_accepted: true,
      type: 'client',
    });
    console.log('  ✓ Users created (1 Admin, 3 Attorneys, 3 Clients)');

    // 2. Attorneys
    await db.attorneys.create({
      user_id: (attorneyUser1 as any).id,
      status: 'active',
      linkedin_url: 'https://linkedin.com/in/sarah-jenkins',
      date_membership: new Date('2021-01-15'),
      picture_path: 'uploads/seeder/attorney-1.png',
      file_id: '',
    });

    await db.attorneys.create({
      user_id: (attorneyUser2 as any).id,
      status: 'active',
      linkedin_url: 'https://linkedin.com/in/alexandre-mercier',
      date_membership: new Date('2020-06-10'),
      picture_path: 'uploads/seeder/attorney-2.png',
      file_id: '',
    });

    await db.attorneys.create({
      user_id: (attorneyUser3 as any).id,
      status: 'active',
      linkedin_url: 'https://linkedin.com/in/elena-rostova',
      date_membership: new Date('2022-03-20'),
      picture_path: 'uploads/seeder/attorney-3.png',
      file_id: '',
    });
    console.log('  ✓ Attorneys created with linked portraits');

    // 3. Categories
    const catAffaires = await db.categories.create({ name: 'Droit des affaires' });
    const catFamille = await db.categories.create({ name: 'Droit de la famille' });
    const catImmobilier = await db.categories.create({ name: 'Droit immobilier' });
    const catTravail = await db.categories.create({ name: 'Droit du travail' });
    const catFiscal = await db.categories.create({ name: 'Droit fiscal' });
    const catPenal = await db.categories.create({ name: 'Droit pénal' });
    console.log('  ✓ Categories created');

    // 4. Services
    const service1 = await db.services.create({
      name: 'Création et Statuts de Société',
      description: 'Accompagnement juridique complet pour la constitution de société (SARL, SAS, SCI) : rédaction des statuts, formalités d\'immatriculation et pacte d\'associés.',
      requestedFiles: ["Pièce d'identité des fondateurs", "Justificatif d'adresse du siège social", "Projet de statuts ou extrait Kbis"],
      coverImage: 'uploads/seeder/service-1.png',
      file_id: '',
      price: 450,
      createdBy: (admin as any).id,
    });

    const service2 = await db.services.create({
      name: 'Procédure de Divorce et Médiation',
      description: 'Assistance bienveillante et stratégique pour le divorce par consentement mutuel ou contentieux, incluant la garde des enfants et la liquidation du régime matrimonial.',
      requestedFiles: ["Livret de famille", "Copie intégrale d'acte de mariage", "Dernier avis d'imposition"],
      coverImage: 'uploads/seeder/service-2.png',
      file_id: '',
      price: 600,
      createdBy: (admin as any).id,
    });

    const service3 = await db.services.create({
      name: 'Contentieux et Litiges Immobiliers',
      description: 'Conseil et défense pour bail commercial, loyers impayés, vices cachés, litiges de copropriété et transactions immobilières complexes.',
      requestedFiles: ["Bail ou acte authentique d'achat", "Mises en demeure échangées", "Constat de commissaire de justice"],
      coverImage: 'uploads/seeder/service-3.png',
      file_id: '',
      price: 350,
      createdBy: (admin as any).id,
    });

    const service4 = await db.services.create({
      name: 'Rupture Conventionnelle et Conseil',
      description: 'Négociation d\'indemnités de départ, assistance à l\'entretien de rupture conventionnelle et représentation devant le Conseil de Prud\'hommes.',
      requestedFiles: ["Contrat de travail et avenants", "3 derniers bulletins de salaire", "Courriers échangés"],
      coverImage: 'uploads/seeder/service-1.png',
      file_id: '',
      price: 400,
      createdBy: (admin as any).id,
    });
    console.log('  ✓ Services created with linked cover images');

    // 5. Problems
    await db.problems.create({
      name: 'Création de SAS / SARL',
      service_id: (service1 as any).id,
      category_id: (catAffaires as any).id,
    });
    await db.problems.create({
      name: 'Pacte d\'actionnaires',
      service_id: (service1 as any).id,
      category_id: (catAffaires as any).id,
    });
    await db.problems.create({
      name: 'Divorce par consentement',
      service_id: (service2 as any).id,
      category_id: (catFamille as any).id,
    });
    await db.problems.create({
      name: 'Garde des enfants',
      service_id: (service2 as any).id,
      category_id: (catFamille as any).id,
    });
    await db.problems.create({
      name: 'Litige bail commercial',
      service_id: (service3 as any).id,
      category_id: (catImmobilier as any).id,
    });
    await db.problems.create({
      name: 'Licenciement abusif',
      service_id: (service4 as any).id,
      category_id: (catTravail as any).id,
    });
    console.log('  ✓ Problems linked to services and categories');

    // 6. Blogs (title <= 20 chars due to model constraint)
    await db.blogs.create({
      title: 'Statuts de SAS 2026',
      likes: 42,
      body: 'La rédaction des statuts de société par actions simplifiée requiert une attention particulière quant aux clauses d\'agrément et d\'inaliénabilité. Voici les points clés pour sécuriser votre investissement et vos relations entre actionnaires.',
      readingDuration: 6,
      image: 'uploads/seeder/blog-1.png',
      file_id: '',
      categoryId: (catAffaires as any).id,
      userId: (attorneyUser1 as any).id,
      accepted: true,
      rejectionReason: null,
    });

    await db.blogs.create({
      title: 'Guide du divorce',
      likes: 28,
      body: 'Le divorce sans juge permet une séparation rapide lorsque les conjoints s\'accordent sur toutes les conséquences patrimoniales et familiales. Découvrez les étapes indispensables devant notaire.',
      readingDuration: 5,
      image: 'uploads/seeder/blog-2.png',
      file_id: '',
      categoryId: (catFamille as any).id,
      userId: (attorneyUser2 as any).id,
      accepted: true,
      rejectionReason: null,
    });

    await db.blogs.create({
      title: 'Bail commercial',
      likes: 35,
      body: 'La révision triennale et le renouvellement du bail commercial obéissent à des règles strictes régies par le Code de commerce. Anticipez les délais pour protéger votre fonds de commerce.',
      readingDuration: 7,
      image: 'uploads/seeder/blog-3.png',
      file_id: '',
      categoryId: (catImmobilier as any).id,
      userId: (attorneyUser3 as any).id,
      accepted: true,
      rejectionReason: null,
    });
    console.log('  ✓ Blogs created with linked cover images');

    // 7. Testimonials
    await db.testimonials.create({
      userId: (clientUser1 as any).id,
      serviceId: (service1 as any).id,
      feedback: 'Un accompagnement exceptionnel pour la création de notre société. Maître Jenkins a su nous conseiller à chaque étape avec clarté et professionnalisme.',
    });

    await db.testimonials.create({
      userId: (clientUser2 as any).id,
      serviceId: (service2 as any).id,
      feedback: 'Dans un moment personnel délicat, Maître Mercier a fait preuve d\'une grande écoute et d\'une efficacité exemplaire pour boucler la procédure dans les meilleures conditions.',
    });

    await db.testimonials.create({
      userId: (clientUser3 as any).id,
      serviceId: (service3 as any).id,
      feedback: 'Grâce au cabinet, notre litige de copropriété a été résolu rapidement sans passer par une longue phase contentieuse. Je recommande vivement leurs services.',
    });
    console.log('  ✓ Testimonials created');

    // 8. Available Slots
    const slots = [
      { day: 1, startTime: '09:00', endTime: '17:00' },
      { day: 2, startTime: '09:00', endTime: '17:00' },
      { day: 3, startTime: '09:00', endTime: '17:00' },
      { day: 4, startTime: '09:00', endTime: '17:00' },
      { day: 5, startTime: '09:00', endTime: '16:00' },
    ];
    for (const slot of slots) {
      await db.AvailableSlot.create(slot);
    }
    console.log('  ✓ Available Slots created');

    console.log('🎉 Seeding completed successfully!');
    if (exitOnFinish) {
      await db.sequelize.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    if (exitOnFinish) {
      try {
        await db.sequelize.close();
      } catch (_) {}
      process.exit(1);
    }
    throw error;
  }
}

if (require.main === module) {
  seedDatabase({ exitOnFinish: true });
}
