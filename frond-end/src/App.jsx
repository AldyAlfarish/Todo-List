import axios from 'axios';
import { useEffect, useState } from 'react';
import {motion} from 'framer-motion';

import Logo from './assets/to-do-list.png'
import Warning from './assets/warning.png'
import './index.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [modalData, setModalData] = useState({
    task_name: '',
    description: '',
    due_date: ''
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await axios.get(`https://todo-list-api-ecru.vercel.app/api/task`);
      setPosts(res.data);
      setFilteredPosts(res.data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.task_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  // post
  const addPost = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://todo-list-api-ecru.vercel.app/api/store-data', modalData);
      alert('Data created successfully');
      const re = await axios.get(`https://todo-list-api-ecru.vercel.app/api/task`);
      setPosts(re.data);
      // setPosts(prevPosts => [...prevPosts, res.data]);
      resetForm();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  }

  // Update
  const updatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://todo-list-api-ecru.vercel.app/api/posts/${modalData.id}`, modalData);
      alert('Data updated successfully');
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === modalData.id ? { ...post, ...modalData } : post
        )
      );
      resetForm();
      setIsEditModalOpen(false); // Close edit modal
    } catch (error) {
      console.error(error);
    }
  };

  // Delete
  const deletePost = async () => {
    try {
      await axios.delete(`https://todo-list-api-ecru.vercel.app/api/posts/${modalData.id}`);
      alert('Data deleted successfully');
      
      // Filter out the deleted post from the posts state
      setPosts(prevPosts =>
        prevPosts.filter(post => post.id !== modalData.id)
      );
      closeModal(); // Close the modal after deletion
    } catch (error) {
      console.error(error);
    }
  };

  const completeTask = async (id) =>{
    try {
      await axios.put(`https://todo-list-api-ecru.vercel.app/api/completed/${id}`, []);
      alert('Data updated successfully');
      const re = await axios.get(`https://todo-list-api-ecru.vercel.app/api/task`);
      setPosts(re.data);
    } catch (error) {
      console.error(error);
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  }

  const resetForm = () => {
    setModalData({
      task_name: '',
      description: '',
      due_date: ''
    });
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openDetailModal = (post) => {
    setModalData(post);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (post) => {
    setModalData(post);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (post) => {
    setModalData(post);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    resetForm();
  };

  const closeModal = () => {
    setModalData({
      task_name: '',
      description: '',
      due_date: ''
    });
    setIsDetailModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsAddModalOpen(false);
  };


  return (
    <div 
      style={{width:'98%', margin:'0 auto'}}>
      <div className="title border-4 border-gray-700 sm:w-1/2 mx-auto mt-3">
        <motion.h2 
          animate={{y: '0%'}}
          initial={{y:'-40%'}}
          transition={{restSpeed: 5}}
          className='text-4xl p-2 text-center font-medium'
        >Todo List
        </motion.h2>
      </div>
        <div className="mb-4 mx-auto w-full sm:w-1/2">
          <div className="p-4 border-4 border-gray-700 h-screen">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by task name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-3 px-4 py-2 border border-gray-700 border-2 shadow-sm focus:outline-none focus:border-black"
              style={{ outline: 'none', boxShadow: 'none' }}
            />
            <button onClick={openAddModal} className='bg-white border-2 border-gray-700 text-black ml-4 p-2 font-semibold btn'>
              New Task
            </button>
            <div className="border-t-2 border-black w-full mt-3"></div>
            <div className="h-48 mb-4 rounded">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <div>
                  {/* Render your posts here */}
                  {currentPosts.map((post) => (
                    <div className="bg-white p-3  m-3 border border-gray-700 border-2 box">
                    <div className="flex relative" key={post.id}>
                      <div className="flex-auto">
                        <div className="ml-6 flex gap-1">
                          <p className="text-black">&#9679;</p>
                          <span className="font-medium text-lg">
                            {post.task_name}
                            </span>
                        </div>
                        <div className="flex gap-3 ml-6 mt-3">
                          <span className={`px-2 text-black text-md font-medium ${post.status === 'Pending' ? 'border-2 border-gray-700' : 'border-2 border-gray-700'}`}>{post.status}</span>
                          <span className="text-gray-500 font-medium">&#128197; {post.due_date}</span>
                        </div>
                      </div>
                      <div className="mt-4 mr-9 sm:mr-6">
                          {/* Dropdown Button */}
                        {/* <div ref={dropdownRef} className="relative"> */}
                          <button
                            id="dropdownMenuIconButton"
                            onClick={() => toggleDropdown(post.id)}
                            className="inline-flex items-center p-2 text-sm font-medium text-center border text-gray-900 bg-white border-2 border-gray-700"
                            type="button"
                          >
                            <svg
                              className="w-5 h-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 4 15"
                            >
                              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>
                          </button>
                          {/* Dropdown Menu */}
                          {dropdownOpen[post.id] && (
                            <div
                              id="dropdownDots"
                              className="absolute z-10 bg-white mt-3 w-25 sm:w-44 border-2 border-gray-700"
                            >
                              <ul
                                className="py-2 text-sm text-black dark:text-gray-200"
                                aria-labelledby="dropdownMenuIconButton"
                              >
                                <li className='border-b-2 border-gray-700'>
                                  <button
                                    onClick={() => openDetailModal(post)}
                                    className="block px-2 sm:px-4 py-2 text-black font-medium text-lg"
                                  >
                                    Detail
                                  </button>
                                </li>
                                {post.status !== 'Completed' && (
                                  <li className='border-b-2 border-gray-700'>
                                    <button
                                      onClick={() => completeTask(post.id)}
                                      className="block px-2 sm:px-4 py-2 text-black font-medium text-lg"
                                    >
                                      Completed
                                    </button>
                                  </li>
                                )}

                                <li className='border-b-2 border-gray-700'>
                                  <button
                                    onClick={() => openEditModal(post)}
                                    className="block px-2 sm:px-4 py-2 text-black font-medium text-lg"
                                  >
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => openDeleteModal(post)}
                                    className="block px-2 sm:px-4 py-2 text-black font-medium text-lg"
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  ))}
                  {/* Pagination */}
                  <nav aria-label="Page navigation example">
                    <ul className="flex justify-center items-center space-x-2 h-8 text-sm">
                      <li>
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center justify-center px-3 h-8 ms-0 text-gray-500 bg-white  hover:text-gray-700"
                          >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="w-2.5 h-2.5 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 1 1 5l4 4"
                            />
                          </svg>
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i}>
                          <button
                            onClick={() => paginate(i + 1)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                              currentPage === i + 1
                                ? 'text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                                : ''
                            }`}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 hover:text-gray-700"
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="w-2.5 h-2.5 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 9 4-4-4-4"
                            />
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
              {/* Add Task Modal */}
              {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white p-4 border-4 border-gray-700 shadow-lg w-96 sm:w-1/3">
                    <h2 className="text-xl font-bold mb-4">Add Task</h2>
                    <form action=''>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="newTaskName"
                        >
                          Task Name
                        </label>
                        <input
                          id="newTaskName"
                          type="text"
                          name='task_name'
                          value={modalData.task_name}
                          onChange={handleChange}
                          className="shadow appearance-none border-2 border-gray-700 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-black"
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="newTaskDescription"
                        >
                          Description
                        </label>
                        <input
                          id="newTaskDescription"
                          type='text'
                          name='description'
                          value={modalData.description}
                          onChange={handleChange}
                          className="shadow appearance-none border-2 border-gray-700 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-black"
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="newTaskDescription"
                        >
                          Due Date
                        </label>
                        <input type='date'
                          id="newTaskDescription"
                          name='due_date'
                          value={modalData.due_date}
                          onChange={handleChange}
                          className="shadow appearance-none border-2 border-gray-700 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-black"
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                      </div>
                      <button
                        className="px-4 py-2 border-2 border-black text-white btn bg-green-500 hover:bg-green-600"
                        onClick={addPost}
                      >
                        Add Task
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="ml-6 px-4 py-2 border-2 border-black text-white btn bg-red-500 hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              )}
              {/* Detail Modal */}
              {isDetailModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white p-4 border-4 border-gray-700 w-96 sm:w-2/5">
                    <p className='text-3xl font-medium'>
                      {modalData.task_name}
                    </p>
                    <div className="border-2 border-gray-700 mt-2"></div>
                    <div className='flex gap-14 mt-3'>
                      <div className="text-gray-400 font-medium">
                        Status
                      </div>
                      <div className="font-medium">
                      {modalData.status}
                      </div>
                    </div>
                    <div className='flex gap-8 mt-3'>
                      <div className="text-gray-400 font-medium">
                        Due Date
                      </div>
                      <div className="font-medium">
                      {modalData.due_date}
                      </div>
                    </div>
                    <div className='mt-3'>
                      <div className="text-black text-xl font-medium">
                      Descriptions
                      </div>
                      <div className="font-medium text-gray-700">
                      {modalData.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={closeModal}
                        className="mt-4 px-4 py-2 text-white btn font-medium bg-red-600 border-2 border-black"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Edit Modal */}
              {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white p-4 border-4 border-gray-700 w-96 sm:w-2/5 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                    {/* Form for editing task */}
                    <form onSubmit={updatePost}>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="task_name"
                        >
                          Task Name
                        </label>
                        <input
                          id="task_name"
                          name="task_name"
                          type="text"
                          value={modalData.task_name} // Menggunakan modalData untuk nilai input
                          onChange={handleChange}
                          className="shadow appearance-none border-2 border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-black"
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="description"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={modalData.description} // Menggunakan modalData untuk nilai input
                          onChange={handleChange}
                          className="shadow appearance-none border-2 border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-black"
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">
                          Due Date
                        </label>
                        <input
                          id="due_date"
                          name="due_date"
                          type="date"
                          value={modalData.due_date} // Menggunakan modalData untuk nilai input
                          onChange={handleChange}
                          className="shadow appearance-none border-2 border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-black"
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                      </div>
                      <button
                        type="submit" // Menggunakan submit untuk mengirimkan data
                        className="px-4 py-2 bg-green-500 text-white border-2 btn hover:bg-green-600 border-2 border-black"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="ml-5 px-4 py-2 bg-red-500 text-white btn hover:bg-red-600 border-2 border-black"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Delete Modal */}
              {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white p-4 border-4 border-gray-700 shadow-lg w-96 sm:w-2/5">
                  <div className="flex  justify-center items-center">
                  <img src={Warning} className='w-1/3' />
                  </div>
                    <h2 className="text-3xl text-center font-bold mb-4">Are you sure you want to delete this task?</h2>
                    <div className="text-center">
                    <button onClick={deletePost} className="mt-4 px-4 py-2 bg-red-500 text-white border-2 border-black btn">
                      Delete
                    </button>
                    <button
                      onClick={closeModal}
                      className="mt-4 ml-6 px-4 py-2 bg-gray-500 text-white border-2 border-black btn"
                    >
                      Cancel
                    </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;


