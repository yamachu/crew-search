// https://github.com/azure-contrib/node-azure-search
export interface AzureSearchOptions {
    url: string;
    key: string;
    version?: string;
    headers?: string[];
}

// https://docs.microsoft.com/en-us/rest/api/searchservice/Search-Documents?redirectedfrom=MSDN
interface SearchQueryParams {
    // Todo: add more query
    search: string;
}

interface AzureSearchClient {
    // Todo: add more apis
    search(index: string, queries: SearchQueryParams, cb: (err: any, results: any) => void): void;
}

// tslint:disable-next-line:no-var-requires
const AzureSearch: (options: AzureSearchOptions) => AzureSearchClient = require('azure-search');

export class AzureSearchService {
    private client: AzureSearchClient;
    private index: string = '';
    constructor(options: AzureSearchOptions) {
        this.client = AzureSearch(options);
    }

    public setIndex(idx: string) {
        this.index = idx;
    }

    public async searchUsers(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.search(this.index, { search: query }, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    }
}
