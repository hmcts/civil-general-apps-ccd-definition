module.exports = {
    full: (type = 'application') => {
        return {
            hwfFeeType: type
        };
    },
    outcome: (type = 'application') => {
        return {
            hwfFullRemissionGrantedForGa: 'Yes'
        };
    },
};
