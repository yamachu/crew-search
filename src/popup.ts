console.log('This is popup process');

import { AzureSearchService } from './AzureSearchClient';

new AzureSearchService({
    url: '',
    key: '',
}).searchUsers('');
