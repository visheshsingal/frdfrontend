import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortType, setSortType] = useState('relevant')

  const applyFilter = () => {
    let filtered = [...products]

    if (showSearch && search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const sortProducts = () => {
    let sorted = [...filteredProducts]

    switch (sortType) {
      case 'low-high':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'high-low':
        sorted.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilteredProducts(sorted)
  }

  useEffect(() => {
    applyFilter()
  }, [search, showSearch, products])

  useEffect(() => {
    sortProducts()
  }, [sortType])

  return (
    <div className="pt-10 border-t">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4">
        <Title text1="OUR" text2="PRODUCTS" />
        <select
          onChange={(e) => setSortType(e.target.value)}
          className="border-2 border-gray-300 text-sm px-3 py-1 rounded"
        >
          <option value="relevant">Sort by: Relevance</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {filteredProducts.map((item, index) => (
          <ProductItem
            key={index}
            name={item.name}
            id={item._id}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  )
}

export default Collection
