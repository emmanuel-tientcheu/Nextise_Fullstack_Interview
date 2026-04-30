import { CourseResponseDTO } from "./domaine/viewModels/CourseResponseDTO"

// DTO pour la liste paginée
export interface PaginatedCoursesResponseDTO {
  data: CourseResponseDTO[]
  total: number
  page: number
  limit: number
  totalPages: number
}