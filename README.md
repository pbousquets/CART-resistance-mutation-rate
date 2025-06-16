This tool provides an **estimate for the prior probability that a gene is inactivated by a random mutation during cell division**. It was developed as a supplementary tool for the research paper: ["The costimulatory domain influences CD19 CAR-T cell resistance development in B-cell malignancies"](https://www.biorxiv.org/content/10.1101/2025.02.28.640707v1).

The primary goal of this estimator is to have a rough estimate of the probability that a gene gets inactivated during cell division due to a somatic mutation. We passed this to our simulation study on CD19 (see the paper [here](https://www.biorxiv.org/content/10.1101/2025.02.28.640707v1)). It is not intended to be an exhaustive or highly precise genomic analysis tool but rather to provide a reasonable prior for modeling and simulation purposes where such an estimate is valuable. The emphasis is on practicality and speed, acknowledging that while more sophisticated prediction tools exist (SIFT, PolyPhen for missense variants for instance), gene length often remains the most significant determinant for this type of estimation.

## How to Run

1.  **Download the Repository:** Clone or download the entire repository to your local machine.
2.  **Open `index.html`:** Navigate to the downloaded folder and open the `index.html` file in any modern web browser (e.g., Chrome, Firefox, Safari, Edge). No web server or special setup is required. All calculations are performed client-side in your browser.

## Methodology

The estimation process incorporates several key factors, implemented primarily within `app.js`:

1.  **Gene Sequence Input:**
    *   Users can paste a raw coding sequence or use a FASTA format.
    *   An example (Human CD19 cDNA) is provided for quick testing.
    *   The number of exons is required for splice site estimations.

2.  **Gene Length:**
    *   The length of the coding sequence (CDS) is a fundamental input (retrieved automatically from the sequence). The probability of a gene being hit by a random mutation is directly proportional to its length, making this a dominant factor in the overall inactivation probability. We assume you know the probability of a random mutation per base per cell division (e.g., we used 1e-8 as a reference, provided by [Williams et al, Nature Communications, 2020](https://www.nature.com/articles/s41467-020-14844-6), which is adjustable via a slider in the user interface.

3.  **Single Nucleotide Variants (SNVs):**
    *   The tool (`analyzeSNVs` function in `app.js`) systematically considers all possible single nucleotide changes across the provided gene sequence.
    *   Each potential SNV is translated into its corresponding amino acid change (if any) using a standard genetic code table (`geneticCode` in `app.js`).
    *   Mutations are classified as:
        *   **Synonymous:** No change in amino acid.
        *   **Missense:** Results in a different amino acid.
        *   **Nonsense:** Introduces a premature stop codon.
        *   **Start Codon Loss:** Alters the initial ATG start codon.
        *   **Stop Codon Loss:** Eliminates a stop codon, leading to read-through.

4.  **Missense Mutation Impact (Grantham Score):**
    *   The functional impact of missense mutations is assessed using the **Grantham score** (`getGranthamDistance` function in `grantham_matrix.js`). This score quantifies the physicochemical difference between the original and substituted amino acids.
    *   Three categories of missense severity (Conservative, Moderate, Severe) are defined based on Grantham distance thresholds. These thresholds are adjustable via sliders in the user interface (`index.html`).
    *   The Grantham score is a historically used proxy for missense impact. While more modern, computationally intensive tools like PolyPhen-2, SIFT, or CADD can offer higher accuracy in predicting the functional consequences of missense mutations, they are beyond the scope of this tool, which aims for rapid prior estimation. For this purpose, where gene length is a primary determinant, the Grantham score provides a computationally efficient and adequate approximation.

5.  **Splice Site Mutations:**
    *   Mutations affecting canonical splice sites are known to frequently disrupt splicing and lead to gene inactivation.
    *   The tool (`analyzeSpliceSites` function in `app.js`) considers the two bases at each end of an exon (i.e., four bases per splice junction: the last two bases of the exon and the first two bases of the intron for a donor site, and the last two bases of the intron and first two bases of the exon for an acceptor site). For a cDNA sequence, it estimates this based on the number of exons, effectively considering (Exon Count - 1) \* 4 critical bases at splice junctions.
    *   The probability that a mutation at these sites is inactivating is user-adjustable via a slider (`spliceInactivationRate`).

6.  **Indel Mutations:**
    *   The tool (`analyzeIndelImpact` function in `app.js`) considers both frameshift and in-frame indels.
    *   **Frameshift Indels:** Insertions or deletions not a multiple of three bases typically cause a frameshift, leading to a completely different and usually non-functional protein product. These are assumed to be highly inactivating (user-adjustable probability, defaults to high).
    *   **In-frame Indels:** Insertions or deletions of a multiple of three bases. Their impact is considered less severe than frameshifts but can still be damaging. The rate at which in-frame indels are damaging is also user-adjustable (`inFrameIndelDamageRate`).
    *   The relative proportion of SNVs to indels, and frameshift to in-frame indels, are user-configurable parameters.

7.  **Parameterization and Interactivity:**
    *   The web interface (`index.html`) allows users to adjust various parameters in real-time, including:
        *   Base mutation rate (e.g., per base per cell division).
        *   SNV/Indel ratio.
        *   Grantham score thresholds for missense classification.
        *   Probabilities of frameshift vs. in-frame indels.
        *   Inactivation rates for splice site mutations and in-frame indels.
        *   Weights for how severely missense mutations of different Grantham score categories contribute to inactivation.
    *   Changes to these parameters trigger recalculations (`recalculateWithSNVs`, `recalculateWithNewParameters` in `app.js`) and update the displayed results and charts.

8.  **Output Estimates:**
    *   The tool provides three overall inactivation probability estimates, reflecting different levels of stringency (`calculateComprehensiveEstimates` in `app.js`):
        *   **Conservative:** Considers only high-confidence inactivating mutations (e.g., nonsense, start/stop loss, frameshift indels, and a user-defined fraction of "severe" missense mutations).
        *   **Moderate (Best Estimate):** Includes a user-defined fraction of "moderate" missense mutations in addition to those in the conservative estimate.
        *   **Liberal (Inclusive):** Includes a user-defined fraction of "conserved" (low Grantham score) missense mutations.
    *   It also calculates and displays:
        *   Expected timescales (e.g., cell divisions) to the first mutation and first inactivating event based on the selected estimate method.
        *   Contributions of SNVs, splice site effects, and indel effects to the total inactivation probability.
        *   Visualizations (charts using Chart.js) for mutation accumulation and impact distribution.

## Calculation Overview

The core calculation logic is centralized in the `calculateComprehensiveEstimates` method within `app.js`. Here's a simplified overview:

1.  **SNV Analysis (`snvResults`):**
    *   Counts are generated for each type of SNV (Synonymous, Missense, Nonsense, Start Loss, Stop Loss).
    *   Missense mutations are further categorized by Grantham score (Mild, Moderate, Severe).
    *   **Inactivating SNV Proportions:**
        *   `snvResults.conservative`: `(Nonsense + (SevereMissense * severe_weight) + StartLoss + StopLoss) / TotalPossibleSNVs`
        *   `snvResults.moderate`: `(Nonsense + (SevereMissense * severe_weight) + (ModerateMissense * moderate_weight) + StartLoss + StopLoss) / TotalPossibleSNVs`
        *   `snvResults.liberal`: `(Nonsense + (SevereMissense * severe_weight) + (ModerateMissense * moderate_weight) + (MildMissense * conservative_weight) + StartLoss + StopLoss) / TotalPossibleSNVs`
        (Note: `severe_weight`, `moderate_weight`, `conservative_weight` are user-adjustable parameters reflecting the assumed inactivation probability for each missense category).

2.  **Splice Site Analysis (`spliceResults`):**
    *   `totalSpliceSites`: Calculated as `(exonCount - 1) * 2`.
    *   `potentialSpliceMutations`: `totalSpliceSites * 2` (assuming 2 critical bases per site, though the code implies 4 per junction, so this might be `totalSpliceSites * 4` effectively, or `(exonCount - 1) * 4`).
    *   `inactivatingSpliceMutations`: `potentialSpliceMutations * spliceInactivationRate`.
    *   `proportionSpliceInactivating`: `inactivatingSpliceMutations / (geneLength * 3)` (normalized against all possible SNVs).

3.  **Indel Analysis (`indelResults`):**
    *   `probIndelInactivating`: `(probFrameshift * frameshiftDamageRate) + ((1 - probFrameshift) * inFrameIndelDamageRate)`.

4.  **Overall Weighted Inactivation Probability:**
    *   The probabilities from SNVs, splice sites, and indels are combined. The tool calculates effective "weights" or contributions for each mutation type based on their relative frequencies and the total number of possible sites.
    *   The `snvIndelRatio` parameter influences the weighting between SNVs and Indels. Splice site contributions are also factored in.
    *   The final "Probability of Inactivation per Random Mutation" for each estimate category (Conservative, Moderate, Liberal) is calculated by summing the weighted contributions of inactivating SNVs, splice site mutations, and indels.

5.  **Mutation Rate Calculations:**
    *   `geneMutationRatePerDivision = baseMutationRatePerBp * geneLength`.
    *   `geneInactivationRatePerDivision = geneMutationRatePerDivision * Overall_P_Inactivation` (using the selected estimate method: Conservative, Moderate, or Liberal).
    *   Expected timescales (time to first mutation, time to first inactivation) are the reciprocals of these rates.

## Scope and Limitations

*   **Approximation for Prior Estimation:** This tool is designed to provide a reasonable prior estimate for gene inactivation. The simplifications made (e.g., Grantham score for missense, uniform mutation rates, estimated splice site impact) are justified by this scope. The impact of inactivation for prior estimation is often more dependent on gene length than on the precise functional prediction of every variant.
*   **Uniform Mutation Rate:** The model assumes a uniform mutation rate across the gene, ignoring potential mutational hotspots, coldspots, or the influence of local genomic context (e.g., chromatin structure, replication timing).
*   **cDNA-Based Analysis:** The analysis is primarily based on coding sequences. Splice site analysis is therefore an estimation based on exon count and user-defined inactivation rates rather than a direct analysis of genomic splice junctions and their specific sequences.
*   **No Complex Interactions:** 
*   **Binary Inactivation (with Gradation):**
*   **Indel Complexity:** The model uses a simplified approach for indel impact, primarily distinguishing between frameshift and in-frame indels. The precise location and nature of an indel can have varied consequences not fully captured.

Despite these limitations, the tool serves its intended purpose of providing a quick, interactive, and adjustable estimate for the probability of gene inactivation by random mutation, which can be a valuable input for various biological models and simulations.

## Citation

If you use this tool, its methodology, or its outputs in your research, please cite the associated paper:
[The costimulatory domain influences CD19 CAR-T cell resistance development in B-cell malignancies; doi: https://doi.org/10.1101/2025.02.28.640707](https://www.biorxiv.org/content/10.1101/2025.02.28.640707v1)

## License
This project is licensed under the CC BY-NC 4.0 License. See the [LICENSE](LICENSE) file for details.