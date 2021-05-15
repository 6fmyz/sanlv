import { Map, Set, List } from 'immutable'
import _ from 'lodash'

// 用keys集合过滤sourceMap，返回的Map的keys与传入参数的keys相同。
export function filterMapByKeys(sourceMap, keys) {
  const exclude = []
  let newMap = Map({})
  if (keys && sourceMap && !sourceMap.isEmpty()) {
    let keySet = keys
    if (_.isArray(keySet)) {
      keySet = Set(keys)
    } else if (List.isList(keySet)) {
      keySet = Set(keys)
    }
    newMap = keySet.toMap().map(key => {
      const item = sourceMap.get(key) || sourceMap.get(`${key}`)
      if (!item) {
        exclude.push(key)
      }
      return item
    })
    exclude.forEach(key => {
      newMap = newMap.delete(key)
    })
  }
  return newMap
}

// 深度合并两个Map参数，origin与newMap，并从origin中删除newMap中不包含的key
export function mergeMapDeepAndDelete(origin, newMap, protectKey) {
  const newIds = newMap ? newMap.keySeq().toJS() : []
  const oldIds = origin ? origin.keySeq().toJS() : []
  if (protectKey) {
    newIds.push(protectKey)
  }
  const deleteIds = _.difference(oldIds, newIds)
  let next = deleteIds.reduce((map, id) => map.delete(id), origin)
  next = next.mergeDeep(newMap)
  return next
}

// 获得删除后的List
export function getDelResultIds(ids, targetId) {
  const index = ids ? ids.indexOf(targetId) : -1
  let resultIds = ids
  if (index >= 0) {
    resultIds = resultIds.delete(index)
  }
  return resultIds
}


// 添加进入章节
export function getInBoxIds(targetInbox, targetId) {
  let inboxIds = targetInbox
  if (targetInbox) {
    const isInBox = targetInbox.indexOf(targetId)
    if (isInBox === -1) {
      inboxIds = targetInbox.push(targetId)
    }
  } else {
    inboxIds = List([targetId])
  }
  return inboxIds
}
