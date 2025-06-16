/**
 * Grantham Distance Matrix
 * 
 * The Grantham distance is a measure of the chemical difference between amino acids.
 * Originally described in: Grantham, R. (1974). Amino acid difference formula 
 * to help explain protein evolution. Science 185(4154):862-864.
 * 
 * This is the complete precomputed upper triangular matrix of Grantham distances
 * between all pairs of amino acids.
 */

// Amino acid order for the matrix
const AMINO_ACIDS = ['S', 'R', 'L', 'P', 'T', 'A', 'V', 'G', 'I', 'F', 'Y', 'C', 'H', 'Q', 'N', 'K', 'D', 'E', 'M', 'W'];

// Grantham distance matrix (upper triangle only, symmetric matrix)
const GRANTHAM_MATRIX = {
    'S': {'R': 110, 'L': 145, 'P': 74, 'T': 58, 'A': 99, 'V': 124, 'G': 56, 'I': 142, 'F': 155, 'Y': 144, 'C': 112, 'H': 89, 'Q': 68, 'N': 46, 'K': 121, 'D': 65, 'E': 80, 'M': 135, 'W': 177},
    'R': {'L': 102, 'P': 103, 'T': 71, 'A': 112, 'V': 96, 'G': 125, 'I': 97, 'F': 97, 'Y': 77, 'C': 180, 'H': 29, 'Q': 43, 'N': 86, 'K': 26, 'D': 96, 'E': 54, 'M': 91, 'W': 101},
    'L': {'P': 98, 'T': 92, 'A': 96, 'V': 32, 'G': 138, 'I': 5, 'F': 22, 'Y': 36, 'C': 198, 'H': 99, 'Q': 113, 'N': 153, 'K': 107, 'D': 172, 'E': 138, 'M': 15, 'W': 61},
    'P': {'T': 38, 'A': 27, 'V': 68, 'G': 42, 'I': 95, 'F': 114, 'Y': 110, 'C': 169, 'H': 77, 'Q': 76, 'N': 91, 'K': 103, 'D': 108, 'E': 93, 'M': 87, 'W': 147},
    'T': {'A': 58, 'V': 69, 'G': 59, 'I': 89, 'F': 103, 'Y': 92, 'C': 149, 'H': 47, 'Q': 42, 'N': 65, 'K': 78, 'D': 85, 'E': 65, 'M': 81, 'W': 128},
    'A': {'V': 64, 'G': 60, 'I': 94, 'F': 113, 'Y': 112, 'C': 195, 'H': 86, 'Q': 91, 'N': 111, 'K': 106, 'D': 126, 'E': 107, 'M': 84, 'W': 148},
    'V': {'G': 109, 'I': 29, 'F': 50, 'Y': 55, 'C': 192, 'H': 84, 'Q': 96, 'N': 133, 'K': 97, 'D': 152, 'E': 121, 'M': 21, 'W': 88},
    'G': {'I': 135, 'F': 153, 'Y': 147, 'C': 159, 'H': 98, 'Q': 87, 'N': 80, 'K': 127, 'D': 94, 'E': 98, 'M': 127, 'W': 184},
    'I': {'F': 21, 'Y': 33, 'C': 198, 'H': 94, 'Q': 109, 'N': 149, 'K': 102, 'D': 168, 'E': 134, 'M': 10, 'W': 61},
    'F': {'Y': 22, 'C': 205, 'H': 100, 'Q': 116, 'N': 158, 'K': 102, 'D': 177, 'E': 140, 'M': 28, 'W': 40},
    'Y': {'C': 194, 'H': 83, 'Q': 99, 'N': 143, 'K': 85, 'D': 160, 'E': 122, 'M': 36, 'W': 37},
    'C': {'H': 174, 'Q': 154, 'N': 139, 'K': 202, 'D': 154, 'E': 170, 'M': 196, 'W': 215},
    'H': {'Q': 24, 'N': 68, 'K': 32, 'D': 81, 'E': 40, 'M': 87, 'W': 115},
    'Q': {'N': 46, 'K': 53, 'D': 61, 'E': 29, 'M': 101, 'W': 130},
    'N': {'K': 94, 'D': 23, 'E': 42, 'M': 142, 'W': 174},
    'K': {'D': 101, 'E': 56, 'M': 95, 'W': 110},
    'D': {'E': 45, 'M': 160, 'W': 181},
    'E': {'M': 126, 'W': 152},
    'M': {'W': 67}
};

/**
 * Get the Grantham distance between two amino acids
 * @param {string} aa1 - First amino acid (single letter code)
 * @param {string} aa2 - Second amino acid (single letter code)
 * @returns {number} - Grantham distance (0 if same amino acid, or the distance value)
 */
function getGranthamDistance(aa1, aa2) {
    // Same amino acid = distance 0
    if (aa1 === aa2) {
        return 0;
    }
    
    // Handle stop codons
    if (aa1 === '*' || aa2 === '*') {
        return 1000; // Very high penalty for stop codons
    }
    
    // Check if both amino acids are valid
    if (!AMINO_ACIDS.includes(aa1) || !AMINO_ACIDS.includes(aa2)) {
        return 50; // Default distance for unknown amino acids
    }
    
    // The matrix is upper triangular, so we need to check both directions
    if (GRANTHAM_MATRIX[aa1] && GRANTHAM_MATRIX[aa1][aa2] !== undefined) {
        return GRANTHAM_MATRIX[aa1][aa2];
    } else if (GRANTHAM_MATRIX[aa2] && GRANTHAM_MATRIX[aa2][aa1] !== undefined) {
        return GRANTHAM_MATRIX[aa2][aa1];
    }
    
    // Fallback - should not happen with valid amino acids
    return -50000;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getGranthamDistance, GRANTHAM_MATRIX, AMINO_ACIDS };
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.getGranthamDistance = getGranthamDistance;
    window.GRANTHAM_MATRIX = GRANTHAM_MATRIX;
    window.AMINO_ACIDS = AMINO_ACIDS;
}
