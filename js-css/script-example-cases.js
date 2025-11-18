document.addEventListener("DOMContentLoaded", function () {
  const cases = [
    { title: "Case 1", img: "example-case-images/Case 1.jpg", desc: "A wooden flower" },
    { title: "Case 2", img: "example-case-images/Case 2.jpg", desc: "A wooden doll of a Japanese girl with multiple patterns" },
    { title: "Case 3", img: "example-case-images/Case 3.jpg", desc: "A wooden bird with multiple patterns" },
    { title: "Case 4", img: "example-case-images/Case 4.jpg", desc: "Basic Ainu motifs" },
    { title: "Case 5", img: "example-case-images/Case 5.jpg", desc: "An Ainu motif made of basic motifs" },
    { title: "Case 6", img: "example-case-images/Case 6.jpg", desc: "An Ainu motif made of basic motifs" },
    { title: "Case 7", img: "example-case-images/Case 7.jpg", desc: "An Ainu motif made of basic motifs" },
    { title: "Case 8", img: "example-case-images/Case 8.jpg", desc: "Some Japanese textile motifs" },
    { title: "Case 9", img: "example-case-images/Case 9.jpg", desc: "Ryukyu (Okinawa) patterns found in Bingata and Kasuri" },
    { title: "Case 10", img: "example-case-images/Case 10.jpg", desc: "A pattern (Alpona / Rangoli) found in Sanatan culture" },
    { title: "Case 11", img: "example-case-images/Case 11.jpg", desc: "Some Mandala patterns" },
    { title: "Case 12", img: "example-case-images/Case 12.jpg", desc: "Some Bagladeshi Textile Patterns" },
    { title: "Case 13", img: "example-case-images/Case 13.jpg", desc: "A simple bottle" },
    { title: "Case 14", img: "example-case-images/Case 14.jpg", desc: "A simple pot shape" },
    { title: "Case 15", img: "example-case-images/Case 15.jpg", desc: "A flowerpot" },
    { title: "Case 16", img: "example-case-images/Case 16.jpg", desc: "A toy boat" },
    { title: "Case 17", img: "example-case-images/Case 17.jpg", desc: "A simple cup" },
    { title: "Case 18", img: "example-case-images/Case 18.jpg", desc: "A vase" },
    { title: "Case 19", img: "example-case-images/Case 19.jpg", desc: "A spur gear" },
    { title: "Case 20", img: "example-case-images/Case 20.jpg", desc: "Evolution of Bangla Vowel Alphabets" }
    
  ];

  let index = 0;

  const title = document.getElementById("case-title");
  const image = document.getElementById("case-image");
  const desc = document.getElementById("case-description");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  function updateSlide() {
    title.textContent = cases[index].title;
    image.src = cases[index].img;
    image.alt = cases[index].title;
    if (cases[index].desc) {
      desc.textContent = cases[index].desc;
      desc.style.display = "block";
    } else {
      desc.style.display = "none";
    }
  }

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + cases.length) % cases.length;
    updateSlide();
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % cases.length;
    updateSlide();
  });

  updateSlide();
});
