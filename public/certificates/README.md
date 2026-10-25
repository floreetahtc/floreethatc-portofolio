# Certificate assets

Add original certificate PDFs or images to this directory. The portfolio never creates certificate images and it hides certificate viewing buttons until a real file path is configured.

Expected filenames from the current content model:

- `BTF_certified_certificate.pdf`
- `C3SA_certified_certificate.pdf`
- `CCEP_certified_certificate.pdf`
- `COSA-TCL-CERT-05-698BC2F081.pdf`

After adding a file, set its `file` field in `src/data/portfolio.ts` to a relative public path such as `./certificates/BTF_certified_certificate.pdf` so it works on both local hosting and GitHub Pages.

Other certificates can be added by creating a new entry in the same data file. Only add dates, issuers, credential IDs, and verification URLs that are present in the original source document.
