module.exports = {
    full: (type = 'application') => {
        return {
            hwfFeeType: type
        };
    },
    outcome: (type = 'application') => {
        return {
            hwfFullRemissionGrantedForGa: type === 'application' ? 'Yes' : null,
            hwfFullRemissionGrantedForAdditional: type === 'additional' ? 'Yes' : null,
        };
    },
};
