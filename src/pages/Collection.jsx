import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortType, setSortType] = useState('relevant')

  const applyFilterAndSort = () => {
    let filtered = [...products]

    if (showSearch && search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    switch (sortType) {
      case 'low-high':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'high-low':
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  useEffect(() => {
    applyFilterAndSort()
  }, [search, showSearch, products, sortType])

  return (
    <div className="pt-10 border-t">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4">
        <Title text1="OUR" text2="PRODUCTS" />
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border-2 border-gray-300 text-sm px-3 py-1 rounded"
        >
          <option value="relevant">Sort by: Relevance</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ProductItem
              key={item._id}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  )
}

export default Collection
