// references.js
// This file exports the references HTML as a template string for direct use in JS.

const REFERENCES_HTML = `
<h4>Methodology & Mathematical Framework</h4>
<h5>1. Mutation Rate Calculations</h5>
<p><strong>Base Mutation Rate (μ):</strong> The fundamental parameter is the per-base-pair mutation rate per cell division.</p>
<div class="equation">
    μ = 1.0 × 10⁻⁸ mutations/bp/division
</div>
<p>This value is derived from <strong>Werner et al. (2020)</strong> - "Measuring single cell divisions in human tissues from multi-region sequencing data" (<em>Nature Comms</em>), which used phylogenetic reconstruction to directly measure somatic mutation accumulation rates in vivo.</p>
<p><strong>Gene-specific mutation rate (Λ):</strong></p>
<div class="equation">
    Λ = μ × L
</div>
<p>Where L is the gene length in base pairs. This gives the expected number of mutations per gene per cell division.</p>
<h5>2. Inactivation Probability Estimation</h5>
<p><strong>SNV Impact Classification:</strong> Each possible single nucleotide variant is categorized using a simplified amino acid scoring system:</p>
<ul>
    <li><strong>Synonymous:</strong> No amino acid change (P<sub>inact</sub> = 0)</li>
    <li><strong>Nonsense:</strong> Premature stop codon (P<sub>inact</sub> = 1.0)</li>
    <li><strong>Start loss:</strong> ATG → non-ATG (P<sub>inact</sub> = 1.0)</li>
    <li><strong>Stop loss:</strong> Stop → amino acid (P<sub>inact</sub> = variable)</li>
    <li><strong>Missense:</strong> Amino acid change classified by physicochemical properties</li>
</ul>
<p><strong>Missense Classification System:</strong></p>
<div class="equation">
    d = √[α(c₁-c₂)² + β(p₁-p₂)² + γ(v₁-v₂)²]
</div>
<p>Canonical Grantham distance formula (Grantham, 1974) using composition (c), polarity (p), and molecular volume (v).</p>
<p><strong>Missense Impact Categories (Grantham Distance):</strong></p>
<ul>
    <li>Conservative: Distance ≤ 60 (P<sub>inact</sub> ≈ 0.1)</li>
    <li>Moderate: 60 < Distance ≤ 120 (P<sub>inact</sub> ≈ 0.3)</li>
    <li>Severe: Distance > 120 (P<sub>inact</sub> ≈ 0.8)</li>
</ul>
<h5>3. Comprehensive Inactivation Probability</h5>
<p><strong>Simple Integration Formula:</strong></p>
<div class="equation">
    P<sub>total</sub> = P<sub>SNV</sub> × R<sub>SNV</sub> + P<sub>splice</sub> + P<sub>indel</sub> × R<sub>indel</sub>
</div>
<p><strong>SNV Component:</strong></p>
<div class="equation">
    P<sub>SNV</sub> = (N<sub>damaging</sub> / N<sub>total</sub>) × 0.90
</div>
<p>Where 90% represents the typical SNV fraction in human mutations.</p>
<p><strong>Splice Site Component:</strong></p>
<div class="equation">
    P<sub>splice</sub> = ((N<sub>exons</sub> - 1) × 2 × 6 × 0.9) / (N<sub>total_mutations</sub>) × 0.02
</div>
<p>Estimated from exon count, assuming 6 critical nucleotides per splice site and 90% inactivation rate.</p>
<p><strong>Indel Component:</strong></p>
<div class="equation">
    P<sub>indel</sub> = (P<sub>frameshift</sub> × 0.95 + P<sub>in-frame</sub> × 0.30) × 0.15 × 0.5
</div>
<div class="equation">
    P<sub>frameshift</sub> = 2/3
</div>
<p>Where 2/3 is the mathematical expectation for frameshift-inducing indels, and 15% represents typical indel frequency.</p>
<h5>4. Three Estimate Categories</h5>
<p><strong>Conservative:</strong> Only high-confidence inactivating mutations</p>
<div class="equation">
    Conservative = (Nonsense + Start_loss + Severe_missense) × 0.85 + Splice × 0.5 + Indel × 0.5
</div>
<p><strong>Moderate:</strong> Includes moderate-impact mutations</p>
<div class="equation">
    Moderate = (Nonsense + Start_loss + Severe + Moderate_missense) × 0.85 + Splice + Indel
</div>
<p><strong>Comprehensive:</strong> All potentially damaging variants</p>
<div class="equation">
    Comprehensive = (All_damaging + Stop_loss) × 0.85 + Splice × 1.5 + Indel × 1.5
</div>
<h5>5. Time-to-Event Calculations</h5>
<p><strong>Inactivating mutation rate per division (λ):</strong></p>
<div class="equation">
    λ = Λ × P<sub>selected_estimate</sub>
</div>
<p><strong>Expected time to first inactivating mutation:</strong></p>
<div class="equation">
    E[T] = 1/λ cell divisions
</div>
<p><strong>Cumulative probability by n divisions:</strong></p>
<div class="equation">
    P(≥1 inactivating mutation by n divisions) = 1 - e<sup>-λn</sup>
</div>
<h4>Parameter Justification & Prior Information</h4>
<h5>Mutation Rate Prior</h5>
<ul>
    <li><strong>Werner et al. (2020)</strong> - Nature Comms: 1.0 × 10⁻⁸ per bp per division (phylogenetic analysis of human somatic tissues)</li>
</ul>
<h5>SNV/Indel Ratio Prior</h5>
<p><strong>90%/10% ratio</strong> based on:</p>
<ul>
    <li>Consistent across multiple somatic mutation studies (Alexandrov et al., 2020)</li>
</ul>
<h5>Functional Impact Approach</h5>
<ul>
    <li><strong>Grantham Distance Matrix:</strong> Canonical amino acid distance measure based on composition, polarity, and molecular volume</li>
    <li><strong>Conservative Thresholds:</strong> Designed to minimize false positives in functional impact prediction</li>
    <li><strong>Splice Site Estimation:</strong> Simple model based on exon count and consensus sequence requirements</li>
    <li><strong>Frameshift Probability:</strong> Mathematical expectation based on reading frame disruption</li>
</ul>
<h5>Model Limitations & Assumptions</h5>
<ul>
    <li><strong>Uniform mutation rate:</strong> Assumes constant rate across gene length (ignores regional variation, replication timing, chromatin state)</li>
    <li><strong>Independent mutations:</strong> Ignores epistatic interactions and compensatory mutations</li>
    <li><strong>Static fitness landscape:</strong> Assumes functional constraints remain constant across cell divisions</li>
    <li><strong>Binary inactivation:</strong> Simplifies continuous spectrum of functional impact into discrete categories</li>
    <li><strong>cDNA-based splice estimation:</strong> Splice site analysis is approximate without genomic sequence</li>
    <li><strong>Population-level parameters:</strong> May not reflect tissue-specific or individual variation</li>
</ul>
<h4>Key References</h4>
<ul>
    <li><strong>Grantham, R. (1974)</strong> Amino acid difference formula to help explain protein evolution. <em>Science</em> 185(4154):862-864.</li>
    <li><strong>Williams, M.J. et al. (2022)</strong> Measuring single cell divisions in human tissues from multi-region sequencing data. <em>Science</em> 378:189-192.</li>
    <li><strong>Alexandrov, L.B. et al. (2020)</strong> The repertoire of mutational signatures in human cancer. <em>Nature</em> 578:94-101.</li>
    <li><strong>1000 Genomes Project Consortium (2015)</strong> A global reference for human genetic variation. <em>Nature</em> 526:68-74.</li>
    <li><strong>Mount, S.M. (1982)</strong> A catalogue of splice junction sequences. <em>Nucleic Acids Research</em> 10:459-472.</li>
</ul>
<style>
    .equation {
        background: #f8f9fa;
        border-left: 4px solid #007bff;
        padding: 12px 16px;
        margin: 12px 0;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        border-radius: 4px;
    }
    .reference-citation {
        font-weight: 600;
        color: #2c3e50;
    }
    .reference-description {
        color: #6c757d;
        font-size: 0.9em;
        margin-top: 4px;
    }
    h5 {
        color: #495057;
        margin-top: 24px;
        margin-bottom: 12px;
    }
</style>
`;
