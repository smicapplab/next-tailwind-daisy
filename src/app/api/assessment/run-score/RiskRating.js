export const riskRating1 = (totalScore) => {
    if (totalScore < 615) {
      return "C-";
    } else if (totalScore >= 615 && totalScore < 650) {
      return "C";
    } else if (totalScore >= 650 && totalScore < 680) {
      return "B";
    } else if (totalScore >= 680 && totalScore < 710) {
      return "A";
    } else if (totalScore >= 710) {
      return "A+";
    }
  };
  
  export const riskRating2 = (totalScore) => {
    if (totalScore < 615) {
      return "C";
    } else if (totalScore >= 615 && totalScore < 700) {
      return "B";
    } else if (totalScore >= 700) {
      return "A";
    }
  };
  
  export const riskRating3 = (totalScore) => {
    if (totalScore < 590) {
      return "C-";
    } else if (totalScore >= 590 && totalScore < 615) {
      return "C";
    } else if (totalScore >= 615 && totalScore < 635) {
      return "C+";
    } else if (totalScore >= 635 && totalScore < 660) {
      return "B-";
    } else if (totalScore >= 660 && totalScore < 680) {
      return "B";
    } else if (totalScore >= 680 && totalScore < 700) {
      return "A-";
    } else if (totalScore >= 700 && totalScore < 740) {
      return "A";
    } else if (totalScore >= 740) {
      return "A+";
    }
  };
  
  export const riskRating4 = (totalScore) => {
    if (totalScore < 535) {
      return "NR";
    } else if (totalScore >= 535 && totalScore < 585) {
      return "D";
    } else if (totalScore >= 585 && totalScore < 600) {
      return "SD";
    } else if (totalScore >= 600 && totalScore < 615) {
      return "R";
    } else if (totalScore >= 615 && totalScore < 630) {
      return "CI";
    } else if (totalScore >= 630 && totalScore < 650) {
      return "C";
    } else if (totalScore >= 650 && totalScore < 665) {
      return "CC";
    } else if (totalScore >= 665 && totalScore < 675) {
      return "CCC";
    } else if (totalScore >= 675 && totalScore < 685) {
      return "B";
    } else if (totalScore >= 685 && totalScore < 695) {
      return "BB";
    } else if (totalScore >= 695 && totalScore < 705) {
      return "BBB";
    } else if (totalScore >= 705 && totalScore < 717) {
      return "A";
    } else if (totalScore >= 717 && totalScore < 740.1) {
      return "AA";
    } else if (totalScore >= 740.1) {
      return "AAA";
    }
  };