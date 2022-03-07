exports.getDefaultReportingRange = () => {
    // return an object that has startDate and endDate attributes. with the current
    // UK tax year as values (i.e. 6th April - 5th Apri).

    // Get the start date. If current date >= 6th April, start date is 6th April in current year.
    // Else start date = 6th April last year

    const now = new Date();
    const currentYear = now.getFullYear();
    let startYear = currentYear - 1;
    let endYear = currentYear;
    if (now.getMonth() >= 3 && now.getDate() >= 6) {
        startYear = currentYear;
        endYear = currentYear + 1;
    }

    const startDate = new Date(startYear, 3, 6);
    const endDate = new Date(endYear, 3, 5);

    return {
        startDate, 
        endDate
    };
}
