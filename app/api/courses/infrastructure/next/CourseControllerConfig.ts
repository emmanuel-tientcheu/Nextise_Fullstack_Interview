
import { ITrainerRepository } from "@/app/api/trainers/application/ports/ITrainerRepository"
import { ICourseRepository } from "../../applications/ports/ICourseRepository"
import { CourseController } from "./CourseController"
import { getCourseRepository } from "./CourseConfiguration"
import { getTrainerRepository } from "@/app/api/trainers/infrastructure/next/TrainerConfiguration"
import { CreateCourseUseCase } from "../../applications/useCases/CreateCourseUseCase"
import { UpdateCourseUseCase } from "../../applications/useCases/UpdateCourseUseCase"
import { DeleteCourseUseCase } from "../../applications/useCases/DeleteCourseUseCase"
import { GetCourseByIdUseCase } from "../../applications/useCases/GetCourseByIdUseCase"
import { GetAllCoursesUseCase } from "../../applications/useCases/GetAllCoursesUseCase"
import { AssignTrainerUseCase } from "../../applications/useCases/AssignTrainerUseCase"
import { UnassignTrainerUseCase } from "../../applications/useCases/UnassignTrainerUseCase"

class CourseContainer {
  private static instance: CourseContainer
  private courseRepository: ICourseRepository
  private trainerRepository: ITrainerRepository
  private courseController: CourseController | null = null

  private constructor() {
    this.courseRepository = getCourseRepository()
    this.trainerRepository = getTrainerRepository()
  }

  static getInstance(): CourseContainer {
    if (!CourseContainer.instance) {
      CourseContainer.instance = new CourseContainer()
    }
    return CourseContainer.instance
  }

  // Use Cases
  private getCreateCourseUseCase(): CreateCourseUseCase {
    return new CreateCourseUseCase(this.courseRepository)
  }

  private getUpdateCourseUseCase(): UpdateCourseUseCase {
    return new UpdateCourseUseCase(this.courseRepository)
  }

  private getDeleteCourseUseCase(): DeleteCourseUseCase {
    return new DeleteCourseUseCase(this.courseRepository)
  }

  private getGetCourseByIdUseCase(): GetCourseByIdUseCase {
    return new GetCourseByIdUseCase(this.courseRepository)
  }

  private getGetAllCoursesUseCase(): GetAllCoursesUseCase {
    return new GetAllCoursesUseCase(this.courseRepository)
  }

  // Assign/Unassign Use Cases (nécessitent trainerRepository)
  private getAssignTrainerUseCase(): AssignTrainerUseCase {
    return new AssignTrainerUseCase(this.courseRepository, this.trainerRepository)
  }

  private getUnassignTrainerUseCase(): UnassignTrainerUseCase {
    return new UnassignTrainerUseCase(this.courseRepository)
  }

  // Controller Principal
  getCourseController(): CourseController {
    if (!this.courseController) {
      this.courseController = new CourseController(
        this.getCreateCourseUseCase(),
        this.getUpdateCourseUseCase(),
        this.getDeleteCourseUseCase(),
        this.getGetCourseByIdUseCase(),
        this.getGetAllCoursesUseCase(),
        this.getAssignTrainerUseCase(),
        this.getUnassignTrainerUseCase()
      )
    }
    return this.courseController
  }
}

export const courseContainer = CourseContainer.getInstance()