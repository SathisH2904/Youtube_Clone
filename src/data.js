export const API_KEY = 'AIzaSyALK2KVd0H-M09szwt5lVZbDitemNGwLy4'

export const value_calculater = (value) => {
    if (value >= 1000000) {
        return Math.floor(value / 1000000) + 'M';
    } else if (value >= 1000) {
        return Math.floor(value / 1000) + 'K';
    } else {
        return value
    }
};
