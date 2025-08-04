// FULL UPDATED HOME.JSX WITH POPUP, DARK-MODE, SEARCH, FILTER, EXPORT & PAGINATION

import React, { useState, useEffect } from "react";
import { bookbaseurl } from "../axiosinstance";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPen, FaPlus } from "react-icons/fa";
import { saveAs } from "file-saver";

const Home = () => {
  // ================== STATES ==================
  const [bookForm, setBookForm] = useState({
    BookName: "",
    Tittle: "",
    Author: "",
    SellingPrice: "",
    PublishedDate: "",
    Id: "",
  });
  const [bookList, setBookList] = useState([]);
  const [filteredList, setFilteredList] = useState([]); // for search/filter/pagination
  const [showModal, setShowModal] = useState(false);
  const [issetupdating, setupdating] = useState(false);
  const [searchVal, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [dark, setDark] = useState(false);

  // ================= LOAD BOOKS ==================
  const getAllBookList = async () => {
    const { data } = await bookbaseurl.get("/booklists");
    setBookList(data?.BookList || []);
  };

  useEffect(() => {
    getAllBookList();
  }, []);

  // ================= POPUP ADD/UPDATE ==================
  const handleformchange = (e) => {
    const { name, value } = e.target;
    setBookForm((p) => ({ ...p, [name]: value }));
  };

  const handlesubmit = async () => {
    const { Author, BookName, PublishedDate, SellingPrice, Tittle } = bookForm;
    if (!Author || !BookName || !PublishedDate || !SellingPrice || !Tittle)
      return alert("All Fields Required");

    let data;
    if (!issetupdating) {
      data = (await bookbaseurl.post("/addbook", bookForm)).data;
    } else {
      data = (await bookbaseurl.put("/updatebook", bookForm)).data;
    }
    if (data?.Success) {
      alert(data?.Message);
      setBookForm({
        BookName: "",
        Tittle: "",
        Author: "",
        SellingPrice: "",
        PublishedDate: "",
        Id: "",
      });
      setupdating(false);
      setShowModal(false);
      getAllBookList();
    }
  };

  const handledelete = async (id) => {
    const { data } = await bookbaseurl.post("/deletebook", { id });
    if (data?.Success) {
      alert(data?.Message);
      getAllBookList();
    }
  };

  const handleupdate = (b) => {
    setBookForm({
      BookName: b.BookName,
      Tittle: b.Tittle,
      Author: b.Author,
      SellingPrice: b.SellingPrice,
      PublishedDate: b.PublishedDate,
      Id: b._id,
    });
    setupdating(true);
    setShowModal(true);
  };

  // =============== SEARCH + FILTER =================
  useEffect(() => {
    let data = [...bookList];

    if (searchVal) {
      const s = searchVal.toLowerCase();
      data = data.filter(
        (b) =>
          b.Author.toLowerCase().includes(s) ||
          b.BookName.toLowerCase().includes(s) ||
          b.Tittle.toLowerCase().includes(s)
      );
    }
    if (yearFilter) {
      data = data.filter((b) => b.PublishedDate.includes(yearFilter));
    }
    if (monthFilter) {
      data = data.filter((b) =>
        new Date(b.PublishedDate).toLocaleString("default", {
          month: "short",
        }) === monthFilter
      );
    }
    setFilteredList(data);
    setPage(1);
  }, [bookList, searchVal, yearFilter, monthFilter]);

  // ========== EXPORT CSV ==========
  const exportCSV = () => {
    const csv =
      "Author,Title,Name,Price,Published\n" +
      filteredList
        .map(
          (b) =>
            `${b.Author},${b.Tittle},${b.BookName},${b.SellingPrice},${b.PublishedDate}`
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "books.csv");
  };

  // ========== PAGINATION =============
  const totalPages = Math.ceil(filteredList.length / perPage);
  const showData = filteredList.slice((page - 1) * perPage, page * perPage);

  // ========== YEAR / MONTH OPTIONS ========
  const years = Array.from(
    new Set(bookList.map((b) => b.PublishedDate.slice(-4)))
  );
  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // ========================================= RENDER ======================================
  return (
    <div className={`${dark ? "dark" : ""}`}>
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
          <h1 className="text-3xl font-bold">📚 Book Management</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <FaPlus /> Add Book
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="px-3 py-2 rounded border"
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        {/************** FILTERS ****************/}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            placeholder="Search..."
            value={searchVal}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded w-full sm:w-52 dark:bg-gray-800"
          />
          <select
            className="px-3 py-2 border rounded dark:bg-gray-800"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((y, i) => (
              <option key={i}>{y}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border rounded dark:bg-gray-800"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">All Months</option>
            {monthsShort.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <button
            onClick={exportCSV}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Export CSV
          </button>
        </div>

        {/************** TABLE ****************/}
        <div className="overflow-auto rounded shadow">
          <table className="min-w-full bg-white dark:bg-gray-800 text-sm">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Published</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {showData.length ? (
                showData.map((book, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="px-4 py-2">{book.Author}</td>
                    <td className="px-4 py-2">{book.Tittle}</td>
                    <td className="px-4 py-2">{book.BookName}</td>
                    <td className="px-4 py-2">₹{book.SellingPrice}</td>
                    <td className="px-4 py-2">{book.PublishedDate}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center gap-4">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handledelete(book._id)}
                        >
                          <RiDeleteBinLine size={18} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800"
                          onClick={() => handleupdate(book)}
                        >
                          <FaPen size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No Books Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/************** PAGINATION ****************/}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1
                    ? "bg-red-600 text-white"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/************** MODAL ****************/}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="animate-modal w-[90%] sm:w-[450px] bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
              <h2 className="text-lg font-bold mb-4">
                {issetupdating ? "Update Book" : "Add Book"}
              </h2>
              <div className="space-y-3">
                <input
                  className="inputField"
                  name="BookName"
                  value={bookForm.BookName}
                  onChange={handleformchange}
                  placeholder="Book Name"
                />
                <input
                  className="inputField"
                  name="Tittle"
                  value={bookForm.Tittle}
                  onChange={handleformchange}
                  placeholder="Title"
                />
                <input
                  className="inputField"
                  name="Author"
                  value={bookForm.Author}
                  onChange={handleformchange}
                  placeholder="Author Name"
                />
                <input
                  className="inputField"
                  type="number"
                  name="SellingPrice"
                  value={bookForm.SellingPrice}
                  onChange={handleformchange}
                  placeholder="Price"
                />
                <input
                  className="inputField"
                  type="date"
                  name="PublishedDate"
                  value={bookForm.PublishedDate}
                  onChange={handleformchange}
                />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handlesubmit}
                  className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {issetupdating ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========= TAILWIND EXTRA CLASSES ========= */}
        <style>{`
         .inputField{
           @apply w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-red-400 outline-none;
         }
         @keyframes modal {
           from {opacity:0; transform:scale(0.9)}
           to   {opacity:1; transform:scale(1)}
         }
         .animate-modal{ animation: modal .3s ease }
       `}</style>
      </div>
    </div>
  );
};

export default Home;
