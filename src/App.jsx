import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(""); // For user input
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch the data");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageInput = (e) => {
    setInputPage(e.target.value);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const pageNumber = Number(inputPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      alert(`Please enter a valid page number (1-${totalPages})`);
    }
    setInputPage(""); // Clear input after submission
  };

  return (
    <div className="App">
      <h1>Kickstarter Projects</h1>
      <table id="table" aria-label="Kickstarter Projects" tabIndex="0">
        <caption>List of Kickstarter projects with funding details</caption>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Percentage Funded</th>
            <th>Amount Pledged</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project, index) => (
            <tr key={index}>
              <td>{startIndex + index + 1}</td>
              <td>{project["percentage.funded"]}%</td>
              <td>${project["amt.pledged"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          tabIndex="0"
        >
          &lt; Previous
        </button>
        <span aria-live="polite">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          tabIndex="0"
        >
          Next &gt;
        </button>
        <form onSubmit={handlePageSubmit} className="page-input-form">
          <label htmlFor="pageInput" className="visually-hidden">
            Go to page
          </label>
          <input
            id="pageInput"
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={handlePageInput}
            placeholder="Go to page..."
            aria-label="Go to specific page"
          />
          <button type="submit">Go</button>
        </form>
      </div>
    </div>
  );
};

export default App;
