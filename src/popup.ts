console.log('This is popup process');

import { AzureSearchService } from './services/AzureSearchClient';

new AzureSearchService({
    url: '',
    key: '',
}).searchUsers('');
