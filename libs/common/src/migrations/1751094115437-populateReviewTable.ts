import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateReviewTable1751094115437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Insert two new users
    await queryRunner.query(`
            INSERT INTO user (firstName, lastName, dateOfBirth, email, password, role, isActive)
            VALUES 
              ('Alice', 'Wonderland', '1990-05-10', 'alice@example.com', '$2b$10$HveTHB7OVMpdXzgXULChV.UUjACQTlHc0.qqBpUbjKm2Q9PnKmjVm', 'user', 1),
              ('Bob', 'Builder', '1985-08-20', 'bob@example.com', '$2b$10$HveTHB7OVMpdXzgXULChV.UUjACQTlHc0.qqBpUbjKm2Q9PnKmjVm', 'user', 1);
        `);

    // 2. Add reviews for existing salons by these users
    // Get the user IDs for Alice and Bob
    // (Assumes emails are unique and salons with ids 1-5 exist)
    await queryRunner.query(`
            INSERT INTO salon_review (salonId, userId, rating, comment)
            VALUES
              ((SELECT id FROM salon WHERE name = 'Elegant Salon'), (SELECT id FROM user WHERE email = 'alice@example.com'), 5, 'Amazing experience at Elegant Salon!'),
              ((SELECT id FROM salon WHERE name = 'Modern Cuts'), (SELECT id FROM user WHERE email = 'alice@example.com'), 4, 'Modern Cuts was great, but a bit crowded.'),
              ((SELECT id FROM salon WHERE name = 'Classic Beauty'), (SELECT id FROM user WHERE email = 'bob@example.com'), 5, 'Classic Beauty lives up to its name!'),
              ((SELECT id FROM salon WHERE name = 'Nature Spa'), (SELECT id FROM user WHERE email = 'bob@example.com'), 4, 'Nature Spa was relaxing and peaceful.');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the reviews
    await queryRunner.query(`
            DELETE FROM salon_review WHERE userId IN (
                (SELECT id FROM user WHERE email = 'alice@example.com'),
                (SELECT id FROM user WHERE email = 'bob@example.com')
            );
        `);

    // Remove the users
    await queryRunner.query(`
            DELETE FROM user WHERE email IN ('alice@example.com', 'bob@example.com');
        `);
  }
}
