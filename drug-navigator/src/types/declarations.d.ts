declare namespace JSX {
    interface IntrinsicElements {
        'main-header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            'base-dir'?: string;
            'active-page'?: string;
        };
        'main-footer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            'base-dir'?: string;
        };
    }
}
