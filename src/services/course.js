import * as request from '../utils/request'
import {
  libraries,
  courses,
} from './api'

// 查询答题课堂信息
export async function queryCourseInfoByCourseId(params) {
  return request.GetJson(`${courses}/${params.courseId}`)
}

// 查询答题信息
export async function queryGradesInfoByCourseId(params) {
  return request.GetJson(`${courses}/${params.courseId}/grades`)
}

// 查询答题题库信息
export async function queryLibraryInfoByLibraryId(params) {
  return request.GetJson(`${libraries}/${params.libraryId}`, { abstract: 1 })
}

