// --------------------------------------
// Load Topics for Search Page (data.json)
// --------------------------------------
let jsonData = [];

if (document.getElementById("searchInput")) {
  fetch("data/data.json")
    .then(r => r.json())
    .then(data => {
      console.log("Loaded JSON:", data);
      jsonData = data;
    })
    .catch(err => console.error("JSON load error:", err));

  window.searchJSON = function () {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    jsonData.forEach(entry => {
      if (
        entry.topic?.toLowerCase().includes(input) ||
        entry.subject?.toLowerCase().includes(input)
      ) {
        const block = document.createElement("div");
        block.classList.add("video-block");

        block.innerHTML = `
          <h3>${entry.subject} – ${entry.topic}</h3>
          ${entry.videos.map(v => `
            <iframe width="300" height="200"
                    src="${v.embed_link}"
                    frameborder="0" allowfullscreen></iframe>
            <p><strong>${v.title}</strong></p>
          `).join('')}
          <hr>`;
        resultDiv.appendChild(block);
      }
    });

    if (!resultDiv.innerHTML) resultDiv.textContent = "No topic found.";
  };
}

// --------------------------------------
// Common: Get Selected Exam from URL
// --------------------------------------
const urlParams = new URLSearchParams(window.location.search);
const selectedExam = urlParams.get("exam");

// --------------------------------------
// QP Page Logic (qps.json)
// --------------------------------------
const qpTitle = document.getElementById("examTitle");
const qpContainer = document.getElementById("qpContainer");

if (qpContainer && qpTitle && selectedExam) {
  qpTitle.textContent = `${selectedExam} - Previous Year Question Papers`;

  fetch("data/qps.json")
  
    
    .then(res => res.json())
    .then(data => {
      console.log("Loaded prep.json data:", data);
      const filtered = data.filter(qp =>
        qp.exam?.toLowerCase() === selectedExam.toLowerCase()
    );
      

      if (filtered.length === 0) {
        qpContainer.innerHTML = "<p>No question papers found for this exam.</p>";
        return;
      }

      filtered.forEach(qp => {
        const div = document.createElement("div");
        div.className = "video-block";
        div.innerHTML = `
          <h3>${qp.subject} (${qp.year})</h3>
          <a href="${qp.link}" target="_blank">📄 View PDF</a>
          <hr>`;
        qpContainer.appendChild(div);
      });
    })
    .catch(err => {
      qpContainer.innerHTML = "<p>Failed to load question papers.</p>";
      console.error("Error loading QPs:", err);
    });
    
}

// ----
const selected_Exam = new URLSearchParams(window.location.search).get("exam");
const videoTitle = document.getElementById("videoTitle");
const videoContainer = document.getElementById("videoContainer");

if (videoContainer && videoTitle && selected_Exam) {
  videoTitle.textContent = `${selected_Exam} - Preparation Videos`;

  fetch("data/prep.json")
    .then(res => res.json())
    .then(data => {
      console.log("Loaded prep.json:", data);
      console.log("Selected Exam:", selected_Exam);

      const filtered = data.filter(video =>
        video.exam?.toLowerCase() === selected_Exam.toLowerCase()
    );

      if (filtered.length === 0) {
        videoContainer.innerHTML = "<p>No preparation videos found for this exam.</p>";
        return;
      }

      filtered.forEach(video => {
        const div = document.createElement("div");
        div.className = "video-block";

        const videosHTML = video.embed_link.map(v => `
          <iframe width="300" height="200"
                  src="${v.video}"
                  frameborder="0" allowfullscreen></iframe>
        `).join('');

        div.innerHTML = `
          <h3>${video.title}</h3>
          ${videosHTML}
        `;

        videoContainer.appendChild(div);
      });
    })
    .catch(err => {
      videoContainer.innerHTML = "<p>Failed to load videos.</p>";
      console.error("Error loading videos:", err);
    });
} else {
  console.warn("Page loaded without selectedExam in URL or missing DOM elements");
}
