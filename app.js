// Enhanced Gene Inactivation Analyzer with Mutation Rate Calculations
class EnhancedGeneAnalyzer {
    constructor() {
        // Predefined data
        this.predefinedSequences = {
            "CD19_cDNA": {
                "name": "CD19 (Human)",
                "sequence": "ATGCCACCTCCTCGCCTCCTCTTCTTCCTCCTCTTCCTCACCCCCATGGAAGTCAGGCCCGAGGAACCTCTAGTGGTGAAGGTGGAAGAGGGAGATAACGCTGTGCTGCAGTGCCTCAAGGGGACCTCAGATGGCCCCACTCAGCAGCTGACCTGGTCTCGGGAGTCCCCGCTTAAACCCTTCTTAAAACTCAGCCTGGGGCTGCCAGGCCTGGGAATCCACATGAGGCCCCTGGCCATCTGGCTTTTCATCTTCAACGTCTCTCAACAGATGGGGGGCTTCTACCTGTGCCAGCCGGGGCCCCCCTCTGAGAAGGCCTGGCAGCCTGGCTGGACAGTCAATGTGGAGGGCAGCGGGGAGCTGTTCCGGTGGAATGTTTCGGACCTAGGTGGCCTGGGCTGTGGCCTGAAGAACAGGTCCTCAGAGGGCCCCAGCTCCCCTTCCGGGAAGCTCATGAGCCCCAAGCTGTATGTGTGGGCCAAAGACCGCCCTGAGATCTGGGAGGGAGAGCCTCCGTGTCTCCCACCGAGGGACAGCCTGAACCAGAGCCTCAGCCAGGACCTCACCATGGCCCCTGGCTCCACACTCTGGCTGTCCTGTGGGGTACCCCCTGACTCTGTGTCCAGGGGCCCCCTCTCCTGGACCCATGTGCACCCCAAGGGGCCTAAGTCATTGCTGAGCCTAGAGCTGAAGGACGATCGCCCGGCCAGAGATATGTGGGTAATGGAGACGGGTCTGTTGTTGCCCCGGGCCACAGCTCAAGACGCTGGAAAGTATTATTGTCACCGTGGCAACCTGACCATGTCATTCCACCTGGAGATCACTGCTCGGCCAGTACTATGGCACTGGCTGCTGAGGACTGGTGGCTGGAAGGTCTCAGCTGTGACTTTGGCTTATCTGATCTTCTGCCTGTGTTCCCTTGTGGGCATTCTTCATCTTCAAAGAGCCCTGGTCCTGAGGAGGAAAAGAAAGCGAATGACTGACCCCACCAGGAGATTCTTCAAAGTGACGCCTCCCCCAGGAAGCGGGCCCCAGAACCAGTACGGGAACGTGCTGTCTCTCCCCACACCCACCTCAGGCCTCGGACGCGCCCAGCGTTGGGCCGCAGGCCTGGGGGGCACTGCCCCGTCTTATGGAAACCCGAGCAGCGACGTCCAGGCGGATGGAGCCTTGGGGTCCCGGAGCCCGCCGGGAGTGGGCCCAGAAGAAGAGGAAGGGGAGGGCTATGAGGAACCTGACAGTGAGGAGGACTCCGAGTTCTATGAGAACGACTCCAACCTTGGGCAGGACCAGCTCTCCCAGGATGGCAGCGGCTACGAGAACCCTGAGGATGAGCCCCTGGGTCCTGAGGATGAAGACTCCTTCTCCAACGCTGAGTCTTATGAGAACGAGGATGAAGAGCTGACCCAGCCGGTCGCCAGGACAATGGACTTCCTGAGCCCTCATGGGTCAGCCTGGGACCCCAGCCGGGAAGCAACCTCCCTGGCAGGGTCCCAGTCCTATGAGGATATGAGAGGAATCCTGTATGCAGCCCCCCAGCTCCGCTCCATTCGGGGCCAGCCTGGACCCAATCATGAGGAAGATGCAGACTCTTATGAGAACATGGATAATCCCGATGGGCCAGACCCAGCCTGGGGAGGAGGGGGCCGCATGGGCACCTGGAGCACCAGGTGA",
                "exons": 15,
                "description": "Human CD19 B-cell co-receptor coding sequence"
            }
        };

        // Genetic code table
        this.geneticCode = {
            'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
            'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S',
            'TAT': 'Y', 'TAC': 'Y', 'TAA': '*', 'TAG': '*',
            'TGT': 'C', 'TGC': 'C', 'TGA': '*', 'TGG': 'W',
            'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
            'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
            'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q',
            'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
            'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M',
            'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
            'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
            'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
            'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
            'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
            'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E',
            'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
        };

        // Chart instances for cleanup
        this.charts = {};

        // Current analysis results
        this.currentResults = null;
        this.selectedEstimateMethod = 'conservative';

        this.initializeEventListeners();
        this.initializeParameters();
    }

    initializeEventListeners() {
        // Form submission
        const form = document.getElementById('analysis-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Prevent accidental form reset or clearing
                // Do not call form.reset() or clear any fields here
                this.analyzeGene();
            });
        }

        // Example buttons
        const cd19Btn = document.getElementById('load-cd19');
        if (cd19Btn) {
            cd19Btn.addEventListener('click', () => {
                this.loadExample('CD19_cDNA');
            });
        }

        const clearBtn = document.getElementById('clear-sequence');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearInputs();
            });
        }

        // Parameter reset
        const resetBtn = document.getElementById('reset-parameters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetParameters();
            });
        }

        // Parameters toggle
        const toggleBtn = document.getElementById('toggle-parameters');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleParameters();
            });
        }

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove 'active' from all tab buttons
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                // Add 'active' to clicked button
                btn.classList.add('active');
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                // Show the selected tab content
                const tabName = btn.dataset.tab;
                const tabContent = document.getElementById(`${tabName}-tab`);
                if (tabContent) tabContent.classList.add('active');
                // Optionally update mutation rate displays if switching to mutation-rates tab
                if (tabName === 'mutation-rates' && this.currentResults) {
                    this.displayMutationRateResults(this.currentResults.mutationRateResults);
                }
            });
        });

        // Export buttons
        const exportSummaryBtn = document.getElementById('export-summary');
        if (exportSummaryBtn) {
            exportSummaryBtn.addEventListener('click', () => {
                this.exportSummary();
            });
        }

        const exportDetailedBtn = document.getElementById('export-detailed');
        if (exportDetailedBtn) {
            exportDetailedBtn.addEventListener('click', () => {
                this.exportDetailed();
            });
        }

        // Estimate method selector
        const estimateSelect = document.getElementById('estimate-method');
        if (estimateSelect) {
            estimateSelect.addEventListener('change', (e) => {
                this.selectedEstimateMethod = e.target.value;
                if (this.currentResults) {
                    // Real-time recalculation when estimate method changes
                    this.recalculateMutationRates();
                }
            });
        }
    }

    initializeParameters() {
        // Set up parameter controls with real-time updates - removed unused parameters
        const parameterControls = [
            { id: 'mutation-rate', valueId: 'mutation-rate-value', format: 'log-scientific' },
            { id: 'snv-indel-ratio', valueId: 'snv-ratio-value', format: 'percentage' },
            { id: 'conservative-threshold', valueId: 'conservative-threshold-value', format: 'number' },
            { id: 'moderate-threshold', valueId: 'moderate-threshold-value', format: 'number' },
            { id: 'frameshift-probability', valueId: 'frameshift-probability-value', format: 'decimal' },
            { id: 'splice-inactivation-rate', valueId: 'splice-inactivation-rate-value', format: 'percentage' },
            { id: 'in-frame-indel-damage-rate', valueId: 'in-frame-indel-damage-rate-value', format: 'percentage' }
        ];

        parameterControls.forEach(param => {
            const control = document.getElementById(param.id);
            const valueDisplay = document.getElementById(param.valueId);

            if (control && valueDisplay) {
                // Initialize display value
                this.updateParameterDisplay(param, control.value);
                
                control.addEventListener('input', (e) => {
                    this.updateParameterDisplay(param, e.target.value);
                    this.handleParameterChange(param.id);
                });
                
                // Add change event listener as well to catch final values
                control.addEventListener('change', (e) => {
                    this.updateParameterDisplay(param, e.target.value);
                    this.handleParameterChange(param.id);
                });
            }
        });

        // Ensure SNV/Indel ratio display is correct on load
        const snvRatioControl = document.getElementById('snv-indel-ratio');
        if (snvRatioControl) {
            const snvRatio = parseInt(snvRatioControl.value);
            const indelDisplay = document.getElementById('indel-ratio-value');
            if (indelDisplay) indelDisplay.textContent = 100 - snvRatio;
        }

        this.resetParameters();
    }

    updateParameterDisplay(param, value) {
        const valueDisplay = document.getElementById(param.valueId);
        if (!valueDisplay) return;

        switch (param.format) {
            case 'log-scientific':
                // For mutation-rate slider: value is exponent (e.g., -8)
                const absValue = Math.abs(parseInt(value));
                valueDisplay.textContent = `1.0 × 10⁻${absValue}`;
                break;
            case 'percentage':
                valueDisplay.textContent = `${value}`;
                break;
            case 'decimal':
                valueDisplay.textContent = (parseInt(value) / 100).toFixed(2);
                break;
            case 'decimal-1':
                valueDisplay.textContent = parseFloat(value).toFixed(1);
                break;
            case 'number':
            default:
                valueDisplay.textContent = value;
                break;
        }

        // Special handling for SNV/Indel ratio
        if (param.id === 'snv-indel-ratio') {
            const indelDisplay = document.getElementById('indel-ratio-value');
            if (indelDisplay) indelDisplay.textContent = 100 - parseInt(value);
        }
    }

    resetParameters() {
        // Updated defaults with new Grantham distance thresholds
        const defaults = [
            { id: 'mutation-rate', value: -8, display: '1.0 × 10⁻⁸' },
            { id: 'snv-indel-ratio', value: 90, display: '90' }, 
            { id: 'conservative-threshold', value: 50, display: '50' },
            { id: 'moderate-threshold', value: 100, display: '100' },
            { id: 'frameshift-probability', value: 67, display: '0.67' },
            { id: 'splice-inactivation-rate', value: 90, display: '90' },
            { id: 'in-frame-indel-damage-rate', value: 5, display: '5' }
        ];
        
        defaults.forEach(param => {
            const control = document.getElementById(param.id);
            if (control) {
                control.value = param.value;
                // Force display update using the same logic as input events
                this.updateParameterDisplay({ id: param.id, valueId: `${param.id}-value`, format: this.getParameterFormat(param.id) }, param.value);
            }
        });
        
        // SNV/Indel ratio
        const indelDisplay = document.getElementById('indel-ratio-value');
        if (indelDisplay) indelDisplay.textContent = '10'; // Changed from '15' to '10'
        
        // Trigger recalculation if results exist
        if (this.currentResults) {
            this.recalculateWithNewParameters();
        }
    }

    getParameterFormat(parameterId) {
        const formatMap = {
            'mutation-rate': 'log-scientific',
            'snv-indel-ratio': 'percentage',
            'conservative-threshold': 'number',
            'moderate-threshold': 'number',
            'frameshift-probability': 'decimal',
            'splice-inactivation-rate': 'percentage',
            'in-frame-indel-damage-rate': 'percentage'
        };
        return formatMap[parameterId] || 'number';
    }

    handleParameterChange(parameterId) {
        // Only update if we have current results
        if (!this.currentResults) return;

        console.log(`Parameter changed: ${parameterId}`);

        // Parameters that require SNV recalculation (because they affect classification)
        const snvRecalcParams = [
            'conservative-threshold',
            'moderate-threshold'
        ];

        // Parameters that require full recalculation but not SNV recalculation
        const fullRecalcParams = [
            'frameshift-probability',
            'splice-inactivation-rate',
            'in-frame-indel-damage-rate',
            'snv-indel-ratio'
        ];

        // Parameters that only affect mutation rate calculations
        const mutationRateParams = ['mutation-rate'];

        if (snvRecalcParams.includes(parameterId)) {
            // Need to recalculate SNVs because thresholds changed
            this.recalculateWithSNVs();
        } else if (fullRecalcParams.includes(parameterId)) {
            // Recalculate comprehensive estimates with new parameters
            this.recalculateWithNewParameters();
        } else if (mutationRateParams.includes(parameterId)) {
            // Only recalculate mutation rates
            this.recalculateMutationRates();
        }
    }

    async recalculateWithSNVs() {
        if (!this.currentResults) return;

        // Recalculate SNVs with new thresholds
        const snvResults = await this.analyzeSNVs(this.currentResults.sequence);
        
        // Recalculate splice results
        const spliceResults = this.analyzeSpliceSites(this.currentResults.sequence, this.currentResults.exonCount);
        
        // Recalculate indel results
        const indelResults = this.analyzeIndelImpact(this.currentResults.sequence);
        
        // Recalculate comprehensive estimates
        const comprehensiveResults = this.calculateComprehensiveEstimates(
            snvResults, 
            spliceResults, 
            indelResults
        );

        // Update stored results
        this.currentResults.snvResults = snvResults;
        this.currentResults.spliceResults = spliceResults;
        this.currentResults.indelResults = indelResults;
        this.currentResults.comprehensiveResults = comprehensiveResults;

        // Recalculate mutation rates with new estimates
        this.recalculateMutationRates();

        // Update displays
        this.displayResults();
    }

    recalculateWithNewParameters() {
        if (!this.currentResults) return;

        // Recalculate splice results
        const spliceResults = this.analyzeSpliceSites(this.currentResults.sequence, this.currentResults.exonCount);
        
        // Recalculate indel results
        const indelResults = this.analyzeIndelImpact(this.currentResults.sequence);
        
        // Recalculate comprehensive estimates
        const comprehensiveResults = this.calculateComprehensiveEstimates(
            this.currentResults.snvResults, 
            spliceResults, 
            indelResults
        );

        // Update stored results
        this.currentResults.spliceResults = spliceResults;
        this.currentResults.indelResults = indelResults;
        this.currentResults.comprehensiveResults = comprehensiveResults;

        // Recalculate mutation rates with new estimates
        this.recalculateMutationRates();

        // Update displays
        this.displayResults();
    }

    getMutationRatePerBp() {
        const slider = document.getElementById('mutation-rate');
        const exp = slider ? parseInt(slider.value, 10) : -8;
        return Math.pow(10, exp);
    }
    getSNVIndelRatio() {
        const slider = document.getElementById('snv-indel-ratio');
        const snv = slider ? parseFloat(slider.value) : 90;
        return { snv: snv / 100, indel: 1 - (snv / 100) };
    }
    getFrameshiftProbability() {
        const slider = document.getElementById('frameshift-probability');
        return slider ? parseFloat(slider.value) / 100 : 0.67;
    }
    getInFrameIndelDamageRate() {
        const slider = document.getElementById('in-frame-indel-damage-rate');
        return slider ? parseFloat(slider.value) / 100 : 0.05;
    }
    getSpliceInactivationRate() {
        const slider = document.getElementById('splice-inactivation-rate');
        return slider ? parseFloat(slider.value) / 100 : 0.9;
    }

    analyzeIndelImpact(sequence) {
        const geneLength = sequence.length;
        const mutationRatePerBp = this.getMutationRatePerBp();
        const { indel: indelRatio } = this.getSNVIndelRatio();
        const frameshiftProb = this.getFrameshiftProbability();
        const inFrameDamageRate = this.getInFrameIndelDamageRate();

        // Total indels per division = geneLength * mutationRatePerBp * indelRatio
        const totalIndels = geneLength * mutationRatePerBp * indelRatio;
        const frameshiftIndels = totalIndels * frameshiftProb;
        const inFrameIndels = totalIndels * (1 - frameshiftProb);
        const damagingInFrame = inFrameIndels * inFrameDamageRate;

        return {
            totalIndels,
            frameshiftIndels,
            inFrameIndels,
            damagingInFrame,
            indelInactivationRate: totalIndels > 0 ? (frameshiftIndels + damagingInFrame) / totalIndels : 0
        };
    }

    calculateMutationRates(sequence) {
        const geneLength = sequence.length;
        const mutationRatePerBp = this.getMutationRatePerBp();
        const totalMutationRate = geneLength * mutationRatePerBp;

        // Compute inactivationProbability using the selected estimate method and current comprehensiveResults
        let inactivationProbability = -1;
        if (this.currentResults && this.currentResults.comprehensiveResults) {
            const method = this.selectedEstimateMethod || 'conservative';
            if (method === 'moderate') {
                inactivationProbability = this.currentResults.comprehensiveResults.best / 100;
            } else if (method === 'liberal') {
                inactivationProbability = this.currentResults.comprehensiveResults.liberal / 100;
            } else {
                inactivationProbability = this.currentResults.comprehensiveResults.conservative / 100;
            }
        }

        const inactivatingMutationRate = totalMutationRate * inactivationProbability;
        const timeToFirstInactivation = inactivatingMutationRate > 0 ? 1 / inactivatingMutationRate : Infinity;
        const divisionsToAnalyze = [1, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
        const cumulativeProbabilities = divisionsToAnalyze.map(divisions => {
            const anyMutation = 1 - Math.exp(-totalMutationRate * divisions);
            const inactivatingMutation = 1 - Math.exp(-inactivatingMutationRate * divisions);
            return { divisions, anyMutation, inactivatingMutation };
        });
        return {
            geneLength,
            mutationRatePerBp,
            totalMutationRate,
            inactivatingMutationRate,
            timeToFirstInactivation,
            cumulativeProbabilities
        };
    }

    recalculateMutationRates() {
        if (!this.currentResults) return;

        const geneLength = this.currentResults.sequence.length;
        const mutationRatePerBp = this.getMutationRatePerBp();

        // Use selected estimate method for inactivation probability
        const method = this.selectedEstimateMethod || 'conservative';
        let inactivationProbability;
        if (method === 'moderate') {
            inactivationProbability = this.currentResults.comprehensiveResults.best / 100;
        } else if (method === 'liberal') {
            inactivationProbability = this.currentResults.comprehensiveResults.liberal / 100;
        } else {
            inactivationProbability = this.currentResults.comprehensiveResults.conservative / 100;
        }

        const totalMutationRate = geneLength * mutationRatePerBp;
        const inactivatingMutationRate = totalMutationRate * inactivationProbability;
        const timeToFirstInactivation = inactivatingMutationRate > 0 ? 1 / inactivatingMutationRate : Infinity;

        const divisionsToAnalyze = [1, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
        const cumulativeProbabilities = divisionsToAnalyze.map(divisions => {
            const anyMutation = 1 - Math.exp(-totalMutationRate * divisions);
            const inactivatingMutation = 1 - Math.exp(-inactivatingMutationRate * divisions);
            return { divisions, anyMutation, inactivatingMutation };
        });

        this.currentResults.mutationRateResults = {
            geneLength,
            mutationRatePerBp,
            totalMutationRate,
            inactivatingMutationRate,
            timeToFirstInactivation,
            cumulativeProbabilities
        };

        // Update only the mutation rate displays without full recalculation
        this.updateMutationRateDisplays();
    }



    updateMutationRateDisplays() {
        if (!this.currentResults || !this.currentResults.mutationRateResults) return;

        const results = this.currentResults.mutationRateResults;
        const comprehensiveResults = this.currentResults.comprehensiveResults;
        
        // Update summary cards
        const mutationRateSummary = document.getElementById('mutation-rate-summary');
        const inactivationRiskSummary = document.getElementById('inactivation-risk-summary');
        const bestSummary = document.getElementById('best-summary');
        const estimateMethodLabel = document.getElementById('estimate-method-label');

        // Get current estimate value - fix the mapping
        const method = this.selectedEstimateMethod || 'conservative';
        let value, label;
        if (method === 'moderate') {
            value = comprehensiveResults.best;
            label = 'Probability per random mutation (Moderate Estimate)';
        } else if (method === 'liberal') {
            value = comprehensiveResults.liberal;
            label = 'Probability per random mutation (Comprehensive Estimate)';
        } else {
            value = comprehensiveResults.conservative;
            label = 'Probability per random mutation (Conservative)';
        }

        if (bestSummary) bestSummary.textContent = `${value.toFixed(1)}%`;
        if (estimateMethodLabel) estimateMethodLabel.textContent = label;
        if (mutationRateSummary) 
            mutationRateSummary.textContent = `${(results.totalMutationRate * 1e6).toFixed(2)} × 10⁻⁶`;
        if (inactivationRiskSummary)
            inactivationRiskSummary.textContent = `${(results.inactivatingMutationRate * 1e6).toFixed(3)} × 10⁻⁶`;

        // Update mutation rate results section if visible
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        if (activeTab === 'mutation-rates') {
            this.displayMutationRateResults(results);
        }

        // Update contribution chart
        this.displayContributionChart(comprehensiveResults);
    }

    downloadText(text, filename) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    updateProgress(current, total, message) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) {
            const percentage = (current / total) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${message} (${current}%)`;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    toggleParameters() {
        const content = document.getElementById('parameters-content');
        const toggleBtn = document.getElementById('toggle-parameters');
        const toggleText = toggleBtn.querySelector('.toggle-text');
        const toggleIcon = toggleBtn.querySelector('.toggle-icon');
        
        if (content && toggleBtn) {
            const isVisible = content.style.display !== 'none';
            
            if (isVisible) {
                content.style.display = 'none';
                toggleText.textContent = 'Show Parameters';
                toggleIcon.textContent = '▼';
                toggleBtn.setAttribute('aria-expanded', 'false');
            } else {
                content.style.display = 'block';
                toggleText.textContent = 'Hide Parameters';
                toggleIcon.textContent = '▲';
                toggleBtn.setAttribute('aria-expanded', 'true');
            }
        }
    }

    async analyzeGene() {
        console.log('Starting enhanced gene analysis...');
        
        const analyzeBtn = document.getElementById('analyze-btn');
        const progressContainer = document.getElementById('progress-container');
        const resultsSection = document.getElementById('results-section');

        try {
            // Get inputs
            const geneName = document.getElementById('gene-name')?.value?.trim() || '';
            const sequenceInput = document.getElementById('dna-sequence')?.value?.trim() || '';
            const exonCount = parseInt(document.getElementById('exon-count')?.value || '10');

            if (!geneName || !sequenceInput) {
                alert('Please provide both gene name and sequence.');
                return;
            }

            // Show progress and disable button
            if (analyzeBtn) {
                analyzeBtn.classList.add('btn--loading');
                analyzeBtn.disabled = true;
            }
            
            if (progressContainer) progressContainer.style.display = 'block';
            if (resultsSection) resultsSection.style.display = 'none';

            this.updateProgress(5, 100, 'Parsing sequence...');
            await this.delay(100);

            // Parse sequence
            const { sequence } = this.parseFASTAOrPlain(sequenceInput);

            this.updateProgress(10, 100, 'Validating sequence...');
            await this.delay(100);

            this.validateSequence(sequence);

            // Perform comprehensive analysis
            this.updateProgress(20, 100, 'Analyzing SNVs...');
            await this.delay(100);
            
            const snvResults = await this.analyzeSNVs(sequence);

            this.updateProgress(50, 100, 'Analyzing splice sites...');
            await this.delay(100);
            
            const spliceResults = this.analyzeSpliceSites(sequence, exonCount);

            this.updateProgress(70, 100, 'Estimating indel impact...');
            await this.delay(100);
            
            const indelResults = this.analyzeIndelImpact(sequence);

            this.updateProgress(85, 100, 'Calculating mutation rates...');
            await this.delay(100);
            
            // Use the correct method, no fallback needed
            const mutationRateResults = this.calculateMutationRates(sequence);

            this.updateProgress(95, 100, 'Calculating comprehensive estimates...');
            await this.delay(100);
            
            const comprehensiveResults = this.calculateComprehensiveEstimates(snvResults, spliceResults, indelResults);

            // Store results
            this.currentResults = {
                geneName,
                sequence,
                exonCount,
                snvResults,
                spliceResults,
                indelResults,
                mutationRateResults,
                comprehensiveResults
            };

            // Now update mutation rates with proper inactivation probabilities
            this.recalculateMutationRates();

            this.updateProgress(100, 100, 'Analysis complete!');
            await this.delay(500);

            // Display results
            this.displayResults();

            // Show results
            if (progressContainer) progressContainer.style.display = 'none';
            if (resultsSection) {
                resultsSection.style.display = 'block';
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }

            console.log('Analysis completed successfully');

        } catch (error) {
            console.error('Analysis error:', error);
            alert(`Error: ${error.message}`);
            if (progressContainer) progressContainer.style.display = 'none';
        } finally {
            if (analyzeBtn) {
                analyzeBtn.classList.remove('btn--loading');
                analyzeBtn.disabled = false;
            }
        }
    }

    parseFASTAOrPlain(input) {
        const lines = input.trim().split('\n');
        if (lines[0].startsWith('>')) {
            const header = lines[0].substring(1);
            const sequence = lines.slice(1).join('').replace(/\s/g, '').toUpperCase();
            return { header, sequence };
        } else {
            const sequence = input.replace(/\s/g, '').toUpperCase();
            return { header: null, sequence };
        }
    }

    validateSequence(sequence) {
        if (!/^[ATCG]+$/.test(sequence)) {
            throw new Error('Sequence contains invalid characters. Only A, T, C, G are allowed.');
        }
        if (sequence.length % 3 !== 0) {
            throw new Error('cDNA sequence length must be divisible by 3 (complete codons).');
        }
        if (!sequence.startsWith('ATG')) {
            throw new Error('cDNA sequence must start with ATG (start codon).');
        }
        return true;
    }

    async analyzeSNVs(sequence) {
        const nucleotides = ['A', 'T', 'C', 'G'];
        const results = {
            synonymous: 0,
            conservative: 0,
            moderate: 0,
            severe: 0,
            nonsense: 0,
            start_loss: 0,
            stop_loss: 0
        };
        const sampleRate = sequence.length > 20000 ? 20 : 1;
        let totalProcessed = 0;
        for (let pos = 0; pos < sequence.length; pos += sampleRate) {
            const originalNuc = sequence[pos];
            for (const newNuc of nucleotides) {
                if (newNuc !== originalNuc) {
                    const mutantSeq = sequence.slice(0, pos) + newNuc + sequence.slice(pos + 1);
                    const analysis = this.analyzeSNV(sequence, mutantSeq, pos);
                    if (analysis.type === 'synonymous') {
                        results.synonymous++;
                    } else if (analysis.type === 'missense') {
                        results[analysis.severity]++;
                    } else if (analysis.type === 'nonsense') {
                        results.nonsense++;
                    } else if (analysis.type === 'start_loss') {
                        results.start_loss++;
                    } else if (analysis.type === 'stop_loss') {
                        results.stop_loss++;
                    }
                }
            }
            totalProcessed++;
            if (totalProcessed % 50 === 0) {
                const progress = 20 + (totalProcessed / (sequence.length / sampleRate)) * 30;
                this.updateProgress(Math.round(progress), 100, 'Analyzing SNVs...');
                await this.delay(1);
            }
        }
        if (sampleRate > 1) {
            Object.keys(results).forEach(key => {
                results[key] = Math.round(results[key] * sampleRate);
            });
        }
        return results;
    }

    analyzeSNV(originalSeq, mutantSeq, position) {
        const originalProtein = this.translateSequence(originalSeq);
        const mutantProtein = this.translateSequence(mutantSeq);
        if (position < 3 && originalSeq.startsWith('ATG') && !mutantSeq.startsWith('ATG')) {
            return { type: 'start_loss', severity: 'high' };
        }
        const codonPos = Math.floor(position / 3);
        if (codonPos >= originalProtein.length || codonPos >= mutantProtein.length) {
            return { type: 'synonymous', severity: 'none' };
        }
        const originalAA = originalProtein[codonPos];
        const mutantAA = mutantProtein[codonPos];
        if (originalAA === mutantAA) {
            return { type: 'synonymous', severity: 'none' };
        }
        if (mutantAA === '*' && originalAA !== '*') {
            return { type: 'nonsense', severity: 'high' };
        }
        if (originalAA === '*' && mutantAA !== '*') {
            return { type: 'stop_loss', severity: 'high' };
        }
        const severity = this.classifyMissenseSeverity(originalAA, mutantAA);
        return { type: 'missense', severity: severity };
    }

    translateSequence(sequence) {
        let protein = '';
        for (let i = 0; i < sequence.length; i += 3) {
            const codon = sequence.slice(i, i + 3);
            if (codon.length === 3) {
                protein += this.geneticCode[codon] || 'X';
            }
        }
        return protein;
    }

    classifyMissenseSeverity(originalAA, mutantAA) {
        const score = this.calculateAminoAcidScore(originalAA, mutantAA);
        const conservativeThreshold = parseInt(document.getElementById('conservative-threshold')?.value || '50');
        const moderateThreshold = parseInt(document.getElementById('moderate-threshold')?.value || '100');
        if (score <= conservativeThreshold) return 'conservative';
        else if (score <= moderateThreshold) return 'moderate';
        else return 'severe';
    }

    calculateAminoAcidScore(originalAA, mutantAA) {
        // Use Grantham distance instead of custom scoring
        return getGranthamDistance(originalAA, mutantAA);
    }

    analyzeSpliceSites(sequence, exonCount) {
        const estimatedSpliceSites = Math.max(0, (exonCount - 1) * 2);
        const spliceMutationsPerSite = 4;
        const totalSpliceMutations = estimatedSpliceSites * spliceMutationsPerSite;
        
        // Get the actual splice inactivation rate from the slider
        const spliceInactivationRate = parseFloat(document.getElementById('splice-inactivation-rate')?.value || '90') / 100;
        const inactivatingSpliceMutations = Math.round(totalSpliceMutations * spliceInactivationRate);
        
        return {
            estimatedSpliceSites,
            totalSpliceMutations,
            inactivatingSpliceMutations,
            spliceInactivationRate: totalSpliceMutations > 0 ? inactivatingSpliceMutations / totalSpliceMutations : 0
        };
    }

    displayResults() {
        const results = this.currentResults;
        const bestSummary = document.getElementById('best-summary');
        const mutationRateSummary = document.getElementById('mutation-rate-summary');
        const inactivationRiskSummary = document.getElementById('inactivation-risk-summary');
        
        // Use the selected method for inactivation probability
        const method = this.selectedEstimateMethod || 'conservative';
        let displayValue;
        if (method === 'moderate') {
            displayValue = results.comprehensiveResults.best;
        } else if (method === 'liberal') {
            displayValue = results.comprehensiveResults.liberal;
        } else {
            displayValue = results.comprehensiveResults.conservative;
        }
        
        if (bestSummary) bestSummary.textContent = `${displayValue.toFixed(1)}%`;
        if (mutationRateSummary) mutationRateSummary.textContent = `${(results.mutationRateResults.totalMutationRate * 1e6).toFixed(2)} × 10⁻⁶`;
        if (inactivationRiskSummary) inactivationRiskSummary.textContent = `${(results.mutationRateResults.inactivatingMutationRate * 1e6).toFixed(3)} × 10⁻⁶`;
        
        const conservativeSummary = document.getElementById('conservative-summary');
        const bestEstimateDetail = document.getElementById('best-estimate-detail');
        const liberalSummary = document.getElementById('liberal-summary');
        if (conservativeSummary) conservativeSummary.textContent = `${results.comprehensiveResults.conservative.toFixed(1)}%`;
        if (bestEstimateDetail) bestEstimateDetail.textContent = `${results.comprehensiveResults.best.toFixed(1)}%`;
        if (liberalSummary) liberalSummary.textContent = `${results.comprehensiveResults.liberal.toFixed(1)}%`;
        
        this.displayOverallChart(results.comprehensiveResults, method);
        this.displayContributionChart(results.comprehensiveResults, method);
        this.displayMutationRateResults(results.mutationRateResults);
        this.displaySNVResults(results.snvResults);
        this.displaySpliceResults(results.spliceResults);
        this.displayIndelResults(results.indelResults);
        this.displayReferences();
    }

    displayOverallChart(results, method = this.selectedEstimateMethod) {
        const ctx = document.getElementById('overall-chart')?.getContext('2d');
        if (!ctx) return;
        if (this.charts.overall) {
            this.charts.overall.destroy();
        }
        let inactivating;
        if (method === 'moderate') {
            inactivating = results.best;
        } else if (method === 'liberal') {
            inactivating = results.liberal;
        } else {
            inactivating = results.conservative;
        }
        const neutral = 100 - inactivating;
        this.charts.overall = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Inactivating Mutations', 'Neutral/Tolerated Mutations'],
                datasets: [{
                    data: [inactivating, neutral],
                    backgroundColor: ['#E74C3C', '#27AE60'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw.toFixed(1)}%`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    displayContributionChart(results, method = this.selectedEstimateMethod) {
        const ctx = document.getElementById('contribution-chart')?.getContext('2d');
        if (!ctx) return;
        if (this.charts.contribution) {
            this.charts.contribution.destroy();
        }
        
        // Use contributions based on selected method
        let snvContribution, spliceContribution, indelContribution;
        if (method === 'moderate') {
            snvContribution = results.bestContributions.snvContribution;
            spliceContribution = results.bestContributions.spliceContribution;
            indelContribution = results.bestContributions.indelContribution;
        } else if (method === 'liberal') {
            snvContribution = results.liberalContributions.snvContribution;
            spliceContribution = results.liberalContributions.spliceContribution;
            indelContribution = results.liberalContributions.indelContribution;
        } else {
            snvContribution = results.conservativeContributions.snvContribution;
            spliceContribution = results.conservativeContributions.spliceContribution;
            indelContribution = results.conservativeContributions.indelContribution;
        }

        this.charts.contribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['SNV Effects', 'Splice Site Effects', 'Indel Effects'],
                datasets: [{
                    data: [
                        snvContribution,
                        spliceContribution,
                        indelContribution
                    ],
                    backgroundColor: ['#F39C12', '#E74C3C', '#8E44AD'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw.toFixed(1)}%`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    displayMutationRateResults(results) {
        const container = document.getElementById('mutation-rate-results');
        if (!container) return;
        
        // Calculate proper scientific notation for display
        let mutationRateDisplay;
        if (results.mutationRatePerBp > 0) {
            const exponent = Math.floor(Math.log10(results.mutationRatePerBp));
            const mantissa = results.mutationRatePerBp / Math.pow(10, exponent);
            mutationRateDisplay = `${mantissa.toFixed(1)} × 10${exponent < 0 ? '⁻' + Math.abs(exponent) : (exponent > 0 ? '⁺' + exponent : '')} /bp`;
        } else {
            mutationRateDisplay = '0';
        }

        const html = `
            <div class="mutation-rate-grid">
                <div class="rate-calculation">
                    <h4>Per Cell Division</h4>
                    <div class="rate-stat">
                        <span>Gene Length:</span>
                        <span class="rate-value">${results.geneLength.toLocaleString()} bp</span>
                    </div>
                    <div class="rate-stat">
                        <span>Base Mutation Rate:</span>
                        <span class="rate-value">${mutationRateDisplay}</span>
                    </div>
                    <div class="rate-stat">
                        <span>Total Mutation Prob:</span>
                        <span class="rate-value rate-highlight">${(results.totalMutationRate * 1e6).toFixed(2)} × 10⁻⁶</span>
                    </div>
                    <div class="rate-stat">
                        <span>Inactivation Prob:</span>
                        <span class="rate-value rate-highlight">${(results.inactivatingMutationRate * 1e6).toFixed(3)} × 10⁻⁶</span>
                    </div>
                </div>
                <div class="rate-calculation">
                    <h4>Expected Time Scales</h4>
                    <div class="rate-stat">
                        <span>First Mutation:</span>
                        <span class="rate-value">${(1/results.totalMutationRate).toFixed(0)} divisions</span>
                    </div>
                    <div class="rate-stat">
                        <span>First Inactivation:</span>
                        <span class="rate-value">${results.timeToFirstInactivation === Infinity ? '∞' : Math.round(results.timeToFirstInactivation).toLocaleString()} divisions</span>
                    </div>
                    <div class="rate-stat">
                        <span>50% Inactivation:</span>
                        <span class="rate-value">${results.timeToFirstInactivation === Infinity ? '∞' : Math.round(results.timeToFirstInactivation * 0.693).toLocaleString()} divisions</span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.displayMutationAccumulationChart(results);
    }

    displayMutationAccumulationChart(results) {
        const ctx = document.getElementById('mutation-accumulation-chart')?.getContext('2d');
        if (!ctx) return;
        if (this.charts.accumulation) {
            this.charts.accumulation.destroy();
        }
        const divisions = results.cumulativeProbabilities.map(p => p.divisions);
        const anyMutationData = results.cumulativeProbabilities.map(p => p.anyMutation * 100);
        const inactivatingData = results.cumulativeProbabilities.map(p => p.inactivatingMutation * 100);
        this.charts.accumulation = new Chart(ctx, {
            type: 'line',
            data: {
                labels: divisions,
                datasets: [
                    {
                        label: 'Any Mutation (%)',
                        data: anyMutationData,
                        borderColor: '#27AE60', // Changed to green
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Inactivating Mutation (%)',
                        data: inactivatingData,
                        borderColor: '#E74C3C', // Red
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Cell Divisions' },
                        type: 'logarithmic'
                    },
                    y: {
                        title: { display: true, text: 'Cumulative Probability (%)' },
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    displaySNVResults(snvResults) {
        const totalSNVs = Object.values(snvResults).reduce((sum, val) => sum + val, 0);
        this.createSNVChart(snvResults, totalSNVs);
        const tableBody = document.getElementById('snv-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        const mutationTypes = [
            { name: 'Synonymous', count: snvResults.synonymous, impact: 'None' },
            { name: 'Conservative Missense', count: snvResults.conservative, impact: 'Low' },
            { name: 'Moderate Missense', count: snvResults.moderate, impact: 'Medium' },
            { name: 'Severe Missense', count: snvResults.severe, impact: 'High' },
            { name: 'Nonsense', count: snvResults.nonsense, impact: 'High' },
            { name: 'Start Codon Loss', count: snvResults.start_loss, impact: 'High' },
            { name: 'Stop Codon Loss', count: snvResults.stop_loss, impact: 'High' }
        ];
        mutationTypes.forEach(type => {
            const percentage = ((type.count / totalSNVs) * 100).toFixed(1);
            const row = document.createElement('tr');
            let impactClass = 'impact-none';
            if (type.impact === 'Low') impactClass = 'impact-low';
            else if (type.impact === 'Medium') impactClass = 'impact-medium';
            else if (type.impact === 'High') impactClass = 'impact-high';
            row.innerHTML = `
                <td>${type.name}</td>
                <td>${type.count.toLocaleString()}</td>
                <td>${percentage}%</td>
                <td><span class="impact-label ${impactClass}">${type.impact}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }

    createSNVChart(snvResults, totalSNVs) {
        const ctx = document.getElementById('snv-chart')?.getContext('2d');
        if (!ctx) return;
        if (this.charts.snv) {
            this.charts.snv.destroy();
        }
        const data = {
            labels: [
                'Synonymous',
                'Conservative Missense',
                'Moderate Missense',
                'Severe Missense',
                'Nonsense',
                'Start Loss',
                'Stop Loss'
            ],
            datasets: [{
                data: [
                    snvResults.synonymous,
                    snvResults.conservative,
                    snvResults.moderate,
                    snvResults.severe,
                    snvResults.nonsense,
                    snvResults.start_loss,
                    snvResults.stop_loss
                ],
                backgroundColor: [
                    '#27AE60', // Green instead of blue
                    '#F39C12', // Orange
                    '#E67E22', // Darker orange
                    '#95A5A6', // Gray
                    '#8E44AD', // Purple
                    '#C0392B', // Dark red
                    '#D68910'  // Golden yellow
                ],
                borderWidth: 0
            }]
        };
        this.charts.snv = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const percentage = ((value / totalSNVs) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    displaySpliceResults(spliceResults) {
        const spliceContent = document.getElementById('splice-results');
        if (!spliceContent) return;
        const html = `
            <div class="splice-summary">
                <h4>Splice Site Impact Estimation</h4>
                <p class="text-muted">Based on estimated splice sites from exon count (cDNA analysis)</p>
                <div class="indel-analysis">
                    <div class="indel-type">
                        <h4>Splice Site Estimates</h4>
                        <div class="indel-stat">
                            <span>Estimated Splice Sites:</span>
                            <span class="indel-value">${spliceResults.estimatedSpliceSites}</span>
                        </div>
                        <div class="indel-stat">
                            <span>Potential Splice SNVs:</span>
                            <span class="indel-value">${spliceResults.totalSpliceMutations}</span>
                        </div>
                        <div class="indel-stat">
                            <span>Inactivating Rate:</span>
                            <span class="indel-value">${(spliceResults.spliceInactivationRate * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <p class="help-text">Note: Splice site analysis is estimated based on exon count. For detailed splice analysis, provide genomic sequence with intron coordinates.</p>
            </div>
        `;
        spliceContent.innerHTML = html;
    }

    displayIndelResults(indelResults) {
        const indelContent = document.getElementById('indel-results');
        if (!indelContent) return;

        // Get current slider values for display
        const frameshiftProbSlider = document.getElementById('frameshift-probability')?.value || '67';
        const frameshiftProb = parseInt(frameshiftProbSlider) / 100;
        const inFrameDamageRateSlider = document.getElementById('in-frame-indel-damage-rate')?.value || '5';
        const inFrameDamageRate = parseInt(inFrameDamageRateSlider) / 100;

        // Get mutation rate and indel ratio
        const mutationRatePerBp = this.getMutationRatePerBp();
        const { indel: indelRatio } = this.getSNVIndelRatio();
        const geneLength = this.currentResults?.sequence?.length || 0;

        // Marginal probability per cell division for any indel in the gene
        const perDivisionIndelProb = geneLength * mutationRatePerBp * indelRatio;
        // Marginal probabilities for each type
        const perDivisionFrameshiftProb = perDivisionIndelProb * frameshiftProb;
        const perDivisionInFrameProb = perDivisionIndelProb * (1 - frameshiftProb);
        const perDivisionDamagingInFrameProb = perDivisionInFrameProb * inFrameDamageRate;
        const perDivisionInactivatingIndelProb = perDivisionFrameshiftProb + perDivisionDamagingInFrameProb;

        // Display as probabilities per cell division (×10⁻⁶ for readability)
        const fmt = v => (v * 1e6).toFixed(3);

        // Probabilities as fractions (for context)
        const frameshiftProbDisplay = (frameshiftProb * 100).toFixed(1);
        const inFrameProb = ((1 - frameshiftProb) * 100).toFixed(1);
        const damagingInFrameProb = ((1 - frameshiftProb) * inFrameDamageRate * 100).toFixed(2);
        const overallInactivation = ((frameshiftProb + (1 - frameshiftProb) * inFrameDamageRate) * 100).toFixed(1);

        // Contribution to overall gene inactivation (method-dependent)
        let indelContribution = '';
        if (this.currentResults?.comprehensiveResults) {
            const method = this.selectedEstimateMethod || 'conservative';
            let contribution;
            if (method === 'moderate') {
                contribution = this.currentResults.comprehensiveResults.bestContributions.indelContribution;
            } else if (method === 'liberal') {
                contribution = this.currentResults.comprehensiveResults.liberalContributions.indelContribution;
            } else {
                contribution = this.currentResults.comprehensiveResults.conservativeContributions.indelContribution;
            }
            indelContribution = `<div class="indel-stat">
                        <span>Contribution to Gene Inactivation:</span>
                        <span class="indel-value">${contribution.toFixed(2)}%</span>
                    </div>`;
        }

        const html = `
            <div class="indel-analysis">
                <div class="indel-type">
                    <h4>Frameshift Indels</h4>
                    <div class="indel-stat">
                        <span>Probability (per indel):</span>
                        <span class="indel-value">${frameshiftProbDisplay}%</span>
                    </div>
                    <div class="indel-stat">
                        <span>Marginal Probability (per division):</span>
                        <span class="indel-value">${fmt(perDivisionFrameshiftProb)} × 10⁻⁶</span>
                    </div>
                    <div class="indel-stat">
                        <span>Impact:</span>
                        <span class="indel-value">High (truncation)</span>
                    </div>
                </div>
                <div class="indel-type">
                    <h4>In-Frame Indels</h4>
                    <div class="indel-stat">
                        <span>Probability (per indel):</span>
                        <span class="indel-value">${inFrameProb}%</span>
                    </div>
                    <div class="indel-stat">
                        <span>Marginal Probability (per division):</span>
                        <span class="indel-value">${fmt(perDivisionInFrameProb)} × 10⁻⁶</span>
                    </div>
                    <div class="indel-stat">
                        <span>Damaging (estimated, per indel):</span>
                        <span class="indel-value">${damagingInFrameProb}%</span>
                    </div>
                    <div class="indel-stat">
                        <span>Marginal Damaging (per division):</span>
                        <span class="indel-value">${fmt(perDivisionDamagingInFrameProb)} × 10⁻⁶</span>
                    </div>
                    <div class="indel-stat">
                        <span>Inactivation Rate (slider):</span>
                        <span class="indel-value">${parseInt(inFrameDamageRateSlider)}%</span>
                    </div>
                </div>
                <div class="indel-type">
                    <h4>Overall Indel Inactivation</h4>
                    <div class="indel-stat">
                        <span>Probability (per indel):</span>
                        <span class="indel-value">${overallInactivation}%</span>
                    </div>
                    <div class="indel-stat">
                        <span>Marginal Probability (per division):</span>
                        <span class="indel-value">${fmt(perDivisionInactivatingIndelProb)} × 10⁻⁶</span>
                    </div>
                    ${indelContribution}
                </div>
            </div>
        `;
        indelContent.innerHTML = html;
    }

    displayReferences() {
        const referencesContent = document.getElementById('references-content');
        if (!referencesContent) return;
        // Use the REFERENCES_HTML variable from references.js
        referencesContent.innerHTML = typeof REFERENCES_HTML !== 'undefined' ? REFERENCES_HTML : '<p>References could not be loaded.</p>';
    }

    exportSummary() {
        if (!this.currentResults) return;
        const results = this.currentResults;
        
        // Get current parameter values from sliders
        const mutationRate = document.getElementById('mutation-rate')?.value || '-8';
        const snvRatio = document.getElementById('snv-indel-ratio')?.value || '90';
        const conservativeThreshold = document.getElementById('conservative-threshold')?.value || '50';
        const moderateThreshold = document.getElementById('moderate-threshold')?.value || '100';
        const frameshiftProb = document.getElementById('frameshift-probability')?.value || '67';
        const spliceRate = document.getElementById('splice-inactivation-rate')?.value || '90';
        const inFrameRate = document.getElementById('in-frame-indel-damage-rate')?.value || '5';
        
        const summary = `Enhanced Gene Inactivation Analysis Summary

Gene: ${results.geneName}
Sequence Length: ${results.sequence.length} bp
Exon Count: ${results.exonCount}
Analysis Date: ${new Date().toLocaleDateString()}

INACTIVATION PROBABILITIES:
Conservative Estimate: ${results.comprehensiveResults.conservative.toFixed(2)}%
Moderate Estimate: ${results.comprehensiveResults.best.toFixed(2)}%
Inclusive Estimate: ${results.comprehensiveResults.liberal.toFixed(2)}%

MUTATION RATE CALCULATIONS:
Base Mutation Rate: 1.0 × 10${mutationRate} per bp per division
Total Mutation Probability: ${(results.mutationRateResults.totalMutationRate * 1e6).toFixed(3)} × 10⁻⁶ per division
Inactivation Probability: ${(results.mutationRateResults.inactivatingMutationRate * 1e6).toFixed(4)} × 10⁻⁶ per division

EXPECTED TIME SCALES:
First Mutation: ${(1/results.mutationRateResults.totalMutationRate).toFixed(0)} cell divisions
First Inactivation: ${results.mutationRateResults.timeToFirstInactivation === Infinity ? '∞' : Math.round(results.mutationRateResults.timeToFirstInactivation).toLocaleString()} cell divisions

PARAMETERS USED:
Mutation Rate: 1.0 × 10${mutationRate} per bp per division
Conservative Threshold: ${conservativeThreshold}
Moderate Threshold: ${moderateThreshold}
Frameshift Probability: ${(parseInt(frameshiftProb) / 100).toFixed(2)}
SNV/Indel Ratio: ${snvRatio}%/${100 - parseInt(snvRatio)}%
Splice Inactivation Rate: ${spliceRate}%
In-frame Indel Damage Rate: ${inFrameRate}%
`;
        this.downloadText(summary, `${results.geneName}_enhanced_summary.txt`);
    }

    exportDetailed() {
        if (!this.currentResults) return;
        const results = this.currentResults;
        
        // Get current parameter values from sliders
        const mutationRate = document.getElementById('mutation-rate')?.value || '-8';
        const snvRatio = document.getElementById('snv-indel-ratio')?.value || '90';
        const conservativeThreshold = document.getElementById('conservative-threshold')?.value || '50';
        const moderateThreshold = document.getElementById('moderate-threshold')?.value || '100';
        const frameshiftProb = document.getElementById('frameshift-probability')?.value || '67';
        const spliceRate = document.getElementById('splice-inactivation-rate')?.value || '90';
        const inFrameRate = document.getElementById('in-frame-indel-damage-rate')?.value || '5';
        
        const detailed = `Enhanced Gene Inactivation Analysis - Detailed Report

=== GENE INFORMATION ===
Gene Name: ${results.geneName}
Sequence Length: ${results.sequence.length} bp
Exon Count: ${results.exonCount}
Analysis Date: ${new Date().toISOString()}

=== PARAMETERS USED ===
Mutation Rate: 1.0 × 10${mutationRate} per bp per division
Conservative Threshold: ${conservativeThreshold}
Moderate Threshold: ${moderateThreshold}
Frameshift Probability: ${(parseInt(frameshiftProb) / 100).toFixed(2)}
SNV/Indel Ratio: ${snvRatio}%/${100 - parseInt(snvRatio)}%
Splice Inactivation Rate: ${spliceRate}%
In-frame Indel Damage Rate: ${inFrameRate}%

=== MUTATION RATE ANALYSIS ===
Base Mutation Rate: 1.0 × 10${mutationRate} per bp per division
Gene Mutation Rate: ${(results.mutationRateResults.totalMutationRate * 1e6).toFixed(4)} × 10⁻⁶ per division
Inactivation Rate: ${(results.mutationRateResults.inactivatingMutationRate * 1e6).toFixed(5)} × 10⁻⁶ per division

Expected Time to First Mutation: ${(1/results.mutationRateResults.totalMutationRate).toFixed(0)} cell divisions
Expected Time to First Inactivation: ${results.mutationRateResults.timeToFirstInactivation === Infinity ? '∞' : Math.round(results.mutationRateResults.timeToFirstInactivation).toLocaleString()} cell divisions

=== SNV ANALYSIS RESULTS ===
Synonymous: ${results.snvResults.synonymous.toLocaleString()}
Conservative Missense: ${results.snvResults.conservative.toLocaleString()}
Moderate Missense: ${results.snvResults.moderate.toLocaleString()}
Severe Missense: ${results.snvResults.severe.toLocaleString()}
Nonsense: ${results.snvResults.nonsense.toLocaleString()}
Start Codon Loss: ${results.snvResults.start_loss.toLocaleString()}
Stop Codon Loss: ${results.snvResults.stop_loss.toLocaleString()}

=== SPLICE SITE ANALYSIS ===
Estimated Splice Sites: ${results.spliceResults.estimatedSpliceSites}
Total Splice Mutations: ${results.spliceResults.totalSpliceMutations}
Inactivating Splice Rate: ${(results.spliceResults.spliceInactivationRate * 100).toFixed(2)}%

=== INDEL IMPACT ANALYSIS ===
Total Indels: ${results.indelResults.totalIndels.toFixed(2)}
Frameshift Indels: ${results.indelResults.frameshiftIndels.toFixed(2)}
In-frame Indels: ${results.indelResults.inFrameIndels.toFixed(2)}
Damaging In-frame: ${results.indelResults.damagingInFrame.toFixed(2)}
Indel Inactivation Rate: ${(results.indelResults.indelInactivationRate * 100).toFixed(2)}%

=== COMPREHENSIVE ESTIMATES ===
Conservative: ${results.comprehensiveResults.conservative.toFixed(3)}%
Best Estimate: ${results.comprehensiveResults.best.toFixed(3)}%
Liberal: ${results.comprehensiveResults.liberal.toFixed(3)}%

Contribution by Type (Best Estimate):
- SNV Effects: ${results.comprehensiveResults.bestContributions.snvContribution.toFixed(2)}%
- Splice Effects: ${results.comprehensiveResults.bestContributions.spliceContribution.toFixed(2)}%
- Indel Effects: ${results.comprehensiveResults.bestContributions.indelContribution.toFixed(2)}%

=== CUMULATIVE PROBABILITIES ===
${results.mutationRateResults.cumulativeProbabilities.map(p => 
    `${p.divisions.toLocaleString()} divisions: ${(p.anyMutation * 100).toFixed(2)}% any mutation, ${(p.inactivatingMutation * 100).toFixed(4)}% inactivating`
).join('\n')}
`;
        this.downloadText(detailed, `${results.geneName}_detailed_analysis.txt`);
    }

    loadExample(exampleKey) {
        const example = this.predefinedSequences[exampleKey];
        if (!example) {
            console.error('Example not found:', exampleKey);
            return;
        }
        
        // Fill in the form fields
        const geneNameInput = document.getElementById('gene-name');
        const sequenceInput = document.getElementById('dna-sequence');
        const exonCountInput = document.getElementById('exon-count');
        
        if (geneNameInput) geneNameInput.value = example.name;
        if (sequenceInput) sequenceInput.value = example.sequence;
        if (exonCountInput) exonCountInput.value = example.exons;
        
        console.log('Loaded example:', example.name);
    }

    clearInputs() {
        const geneNameInput = document.getElementById('gene-name');
        const sequenceInput = document.getElementById('dna-sequence');
        const exonCountInput = document.getElementById('exon-count');
        
        if (geneNameInput) geneNameInput.value = '';
        if (sequenceInput) sequenceInput.value = '';
        if (exonCountInput) exonCountInput.value = '10'; // Reset to default
        
        // Clear results if they exist
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) resultsSection.style.display = 'none';
        
        this.currentResults = null;
        
        console.log('Inputs cleared');
    }

    // Calculate comprehensive estimates from SNV, splice, and indel results
    calculateComprehensiveEstimates(snvResults, spliceResults, indelResults) {
    // Defensive: check for missing or malformed input
    if (!snvResults || !spliceResults || !indelResults) {
        return {
            conservative: 0,
            best: 0,
            liberal: 0,
            conservativeContributions: { snvContribution: 0, spliceContribution: 0, indelContribution: 0 },
            bestContributions: { snvContribution: 0, spliceContribution: 0, indelContribution: 0 },
            liberalContributions: { snvContribution: 0, spliceContribution: 0, indelContribution: 0 }
        };
    }

    // Get mutation type ratios
    const { snv: snvRatio, indel: indelRatio } = this.getSNVIndelRatio();
    
    // Calculate total possible mutations (SNVs + potential splice mutations + indels)
    const totalSNVs = Object.values(snvResults).reduce((sum, val) => sum + val, 0);
    
    // Calculate the probability that a random mutation is inactivating for each type
    
    // SNV inactivation probabilities
    const severe_weight = 0.5; // Weight for severe missense mutations
    const moderate_weight = 0.25; // Weight for moderate missense mutations
    const conservative_weight = 0.05; // Weight for conservative missense mutations
    const snvConservative = totalSNVs > 0 ? 
        (snvResults.nonsense + snvResults.severe * severe_weight + snvResults.start_loss + snvResults.stop_loss) / totalSNVs : 0;
    const snvBest = totalSNVs > 0 ? 
        (snvResults.nonsense + snvResults.severe * severe_weight + snvResults.moderate * moderate_weight + snvResults.start_loss + snvResults.stop_loss) / totalSNVs : 0;
    const snvLiberal = totalSNVs > 0 ? 
        (snvResults.nonsense + snvResults.severe * severe_weight + snvResults.moderate * moderate_weight + snvResults.conservative * conservative_weight + snvResults.start_loss + snvResults.stop_loss) / totalSNVs : 0;

    // Splice inactivation probability
    const spliceInactivationProb = spliceResults.totalSpliceMutations > 0 ? 
        spliceResults.inactivatingSpliceMutations / spliceResults.totalSpliceMutations : 0;

    // Indel inactivation probabilities
    const indelConservativeProb = indelResults.indelInactivationRate;
    const indelBestProb = indelResults.indelInactivationRate;
    const indelLiberalProb = indelResults.indelInactivationRate;

    // Weight by mutation frequency to get overall inactivation probability
    // This assumes mutations are distributed proportionally to the sequence context
    
    // Estimate relative frequencies (this is approximate)
    const geneLength = totalSNVs / 3; // Approximate gene length from SNV analysis
    const snvWeight = snvRatio;
    const indelWeight = indelRatio;
    // Splice mutations are much rarer - estimate based on splice sites vs total sequence
    const spliceWeight = spliceResults.estimatedSpliceSites * 4 / geneLength; // 4 critical positions per splice site
    
    // Normalize weights
    const totalWeight = snvWeight + indelWeight + spliceWeight;
    const normalizedSNV = snvWeight / totalWeight;
    const normalizedIndel = indelWeight / totalWeight;
    const normalizedSplice = spliceWeight / totalWeight;

    // Calculate weighted average inactivation probabilities
    const conservative = 100 * (
        normalizedSNV * snvConservative + 
        normalizedIndel * indelConservativeProb + 
        normalizedSplice * spliceInactivationProb
    );
    
    const best = 100 * (
        normalizedSNV * snvBest + 
        normalizedIndel * indelBestProb + 
        normalizedSplice * spliceInactivationProb
    );
    
    const liberal = 100 * (
        normalizedSNV * snvLiberal + 
        normalizedIndel * indelLiberalProb + 
        normalizedSplice * spliceInactivationProb
    );

    // Calculate individual contributions for each method
    const conservativeContributions = {
        snvContribution: normalizedSNV * snvConservative * 100,
        spliceContribution: normalizedSplice * spliceInactivationProb * 100,
        indelContribution: normalizedIndel * indelConservativeProb * 100
    };

    const bestContributions = {
        snvContribution: normalizedSNV * snvBest * 100,
        spliceContribution: normalizedSplice * spliceInactivationProb * 100,
        indelContribution: normalizedIndel * indelBestProb * 100
    };

    const liberalContributions = {
        snvContribution: normalizedSNV * snvLiberal * 100,
        spliceContribution: normalizedSplice * spliceInactivationProb * 100,
        indelContribution: normalizedIndel * indelLiberalProb * 100
    };

    return {
        conservative,
        best,
        liberal,
        conservativeContributions,
        bestContributions,
        liberalContributions
    };
}
}
// Initialize the enhanced analyzer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Enhanced Gene Analyzer...');
    const analyzer = new EnhancedGeneAnalyzer();
    window.geneAnalyzer = analyzer;
    
    // Add debugging
    console.log('Analyzer initialized:', analyzer);
    console.log('Form element:', document.getElementById('analysis-form'));
    console.log('Analyze button:', document.getElementById('analyze-btn'));
});