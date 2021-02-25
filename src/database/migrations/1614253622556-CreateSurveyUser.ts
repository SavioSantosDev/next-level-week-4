import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSurveyUser1614253622556 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'surveys_users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
            },
            {
              name: 'user_id',
              type: 'uuid',
            },
            {
              name: 'survey_id',
              type: 'uuid',
            },
            {
              name: 'value',
              type: 'number',
              isNullable: true, // Initially the value will be saved as null
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            }
          ],
          foreignKeys: [
            // coluna user_id desta tabela referencia a coluna id da tabela users
            {
              name: 'FKUser',
              referencedTableName: 'users',
              referencedColumnNames: ['id'],
              columnNames: ['user_id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            {
              name: 'FKSurvey',
              referencedTableName: 'surveys',
              referencedColumnNames: ['id'],
              columnNames: ['survey_id'],
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          ]
        })
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('surveys_users');
    }

}
