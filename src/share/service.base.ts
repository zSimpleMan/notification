import { FindOptions, Transaction } from "sequelize"
import { ICriteria } from "src/interfaces/interfaces"
import { SequelizeOptionsParser } from '../helpers/query-parser'

export default abstract class<entity> {
  protected repository: any
  protected sequelizeOptionParser: SequelizeOptionsParser

  constructor(entityRespository) {
    this.repository = entityRespository
    this.sequelizeOptionParser = new SequelizeOptionsParser()
  }

  async findAll(criteria: ICriteria, transaction?: Transaction): Promise<entity[]> {
    const parsedCriteria = this.parserSequelizeOptions(criteria)

    const data: entity[] = await this.repository.findAll(<FindOptions>{
      raw: true,
      nest: true,
      ...parsedCriteria,
      transaction
    })

    return data 
  }

  async create(data: any, transaction?: Transaction): Promise<entity> {
    const result = await this.repository.create(data, { transaction })

    return result
  }

  protected parserSequelizeOptions (rawOptions: any): FindOptions {
    return this.sequelizeOptionParser.parse(rawOptions)
  }
}