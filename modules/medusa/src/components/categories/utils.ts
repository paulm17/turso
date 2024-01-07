function compareArrays(arr1, arr2) {
  const changes = [] as { id: string; parentId: string }[]

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i]
    const obj2 = arr2.find(obj => obj.id === obj1.id)

    if (obj2 && obj1.parentId !== obj2.parentId) {
      changes.push({ id: obj2.id, parentId: obj2.parentId })
    }
  }

  return changes
}

function flatten(arr) {
  return arr.reduce((flat, item) => {
    flat.push({ id: item.id, parentId: item.parentId })
    if (item.children && item.children.length) {
      flat.push(...flatten(item.children))
    }
    return flat
  }, [])
}

function nestedCategories(categories) {
  const roots = categories.filter(c => !c.parentId)
  const tree = roots.map(root => {
    return {
      id: root.id,
      name: root.name,
      children: buildTree(root.id, categories),
    }
  })
  return tree
}

function buildTree(parentId, categories) {
  const children = categories.filter(c => c.parentId === parentId)
  const tree = children.map(child => {
    return {
      id: child.id,
      name: child.name,
      children: buildTree(child.id, categories),
    }
  })
  return tree.length ? tree : []
}

export { flatten, nestedCategories, compareArrays }
