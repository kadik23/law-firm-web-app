import dotenv from 'dotenv';
dotenv.config();
import 'module-alias/register';
import bcrypt from 'bcrypt';
import { db } from '../models/index';

export async function seedDatabase(options: { exitOnFinish?: boolean } = { exitOnFinish: true }): Promise<void> {
  const exitOnFinish = options.exitOnFinish ?? true;
  try {
    await db.sequelize.authenticate();
    console.log('🔌 Connected to database successfully.');

    console.log('🔄 Force synchronizing schema from models (sync({ force: true }))...');
    await db.sequelize.sync({ force: true });
    if (db.sequelize.getDialect() === 'postgres') {
      try {
        await db.sequelize.query(`ALTER TYPE "enum_consultations_status" ADD VALUE IF NOT EXISTS 'Completed';`);
      } catch (_) {}
    }
    console.log('✨ All tables cleanly recreated according to model definitions.');

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
    const problem1 = await db.problems.create({
      name: 'Création de SAS / SARL',
      service_id: (service1 as any).id,
      category_id: (catAffaires as any).id,
    });
    await db.problems.create({
      name: 'Pacte d\'actionnaires',
      service_id: (service1 as any).id,
      category_id: (catAffaires as any).id,
    });
    const problem2 = await db.problems.create({
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

    // 9. Consultations
    await db.Consultation.create({
      problem_id: (problem1 as any).id,
      client_id: (clientUser1 as any).id,
      problem_name: 'Création de SAS / SARL',
      problem_description: 'Conseil sur la structure juridique et les statuts.',
      time: '10:00',
      date: '2026-03-25',
      status: 'Accepted',
      mode: 'online',
      meeting_link: 'https://meet.jit.si/lawfirm-consultation-seed',
    });

    await db.Consultation.create({
      problem_id: (problem2 as any).id,
      client_id: (clientUser2 as any).id,
      problem_name: 'Divorce par consentement',
      problem_description: 'Demande de consultation pour procédure amiable.',
      time: '14:30',
      date: '2026-03-26',
      status: 'Pending',
      mode: 'onsite',
    });
    console.log('  ✓ Consultations created');

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
