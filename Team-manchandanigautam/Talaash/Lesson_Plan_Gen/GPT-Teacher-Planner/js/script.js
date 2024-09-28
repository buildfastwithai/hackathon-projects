const otherCheckbox = document.getElementById("supporting_materials_and_resources_other");
  const otherTagInput = document.getElementById("other_tag");

  otherCheckbox.addEventListener("change", function() {
    if (otherCheckbox.checked) {
      otherTagInput.style.display = "block";
    } else {
      otherTagInput.style.display = "none";
    }
  });