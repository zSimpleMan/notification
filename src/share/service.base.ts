import { Inject, Injectable, Scope } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { FindOptions, Transaction, WhereOptions } from "sequelize"
import { Scopes } from "sequelize-typescript"
import { Context } from "src/entities/context.entity"
import { ICriteria } from "src/interfaces/interfaces"
import { QueryService } from "src/query/query.service"

@Injectable({scope: Scope.REQUEST})
export default abstract class<entity> {
  protected readRepository: any
  protected writeRepository: any
  protected sequelizeOptionParser: QueryService
  @Inject(REQUEST) protected req

  constructor(entityReadRespository, entityWriteRespository, queryService) {
    this.readRepository = entityReadRespository
    this.writeRepository = entityWriteRespository
    this.sequelizeOptionParser = queryService
  }

  async findAll(criteria: ICriteria, transaction?: Transaction): Promise<entity[]> {
    const parsedCriteria = this.parserSequelizeOptions(criteria)

    parsedCriteria.where = this.parserOwnerFilter(parsedCriteria)

    const data: entity[] = await this.readRepository.findAll(<FindOptions>{
      raw: true,
      nest: true,
      ...parsedCriteria,
      transaction
    })
    
    return data 
  }

  async create(data: any, transaction?: Transaction): Promise<entity> {
    const result = await this.writeRepository.create(data, { transaction })

    return result
  }

  async update(data: any, transaction?: Transaction) {
    // const result = await this.writeRepository.create(data, { transaction })

    // return result
  }

  async delete(data: any, transaction?: Transaction) {
    // const result = await this.writeRepository.create(data, { transaction })

    // return result
  }

  protected parserSequelizeOptions (rawOptions: any): FindOptions {
    return this.sequelizeOptionParser.parse(rawOptions)
  }

  protected parserOwnerFilter (parsedCriteria: FindOptions): WhereOptions {
    return this.sequelizeOptionParser.ownerFilter(this.readRepository, parsedCriteria.where)
  }
}