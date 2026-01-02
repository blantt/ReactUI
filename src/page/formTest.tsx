export default function app() {
     return (
          <div>
               fomr test page2
               <div className="p-6 space-y-6">
                    <form action="#">
                         <div className="grid grid-cols-6 gap-6">

                              <div className="col-span-6 sm:col-span-3">
                                   <label className="text-sm font-medium text-gray-900 block mb-2">
                                        Product Name
                                   </label>

                                   <input
                                        type="text"
                                        name="product-name"
                                        id="product-name"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        placeholder="Apple Imac 27”"

                                   />
                              </div>

                              <div
                                   className="col-span-6 sm:col-span-3 flex items-center justify-between"
                              >
                                   <span>獨立flex欄位</span>
                                   <button className="bg-blue-500 text-white px-4 py-2 rounded">
                                        右側按鈕
                                   </button>
                              </div>
                              <div className="col-span-6 sm:col-span-3">

                                   <label className="text-sm font-medium text-gray-900 block mb-2">
                                        category
                                   </label>
                                   <input
                                        type="text"
                                        name="category"
                                        id="category"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        placeholder="Electronics"

                                   />
                              </div>
                              <div className="col-span-6 sm:col-span-3">
                                   <label
                                        className="text-sm font-medium text-gray-900 block mb-2"  >
                                        Brand

                                   </label>
                                   <input
                                        type="text"
                                        name="brand"
                                        id="brand"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        placeholder="Apple"

                                   />
                              </div>
                              <div className="col-span-6 sm:col-span-3">

                                   <label
                                        className="text-sm font-medium text-gray-900 block mb-2"  >
                                        Price

                                   </label>

                              </div>
                              <div className="col-span-full">
                                   <label
                                        className="text-sm font-medium text-gray-900 block mb-2"
                                   >Product Details
                                   </label>

                              </div>
                         </div>
                    </form>
               </div>

          </div>
     )

}
