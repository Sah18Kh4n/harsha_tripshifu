import { library } from '@fortawesome/fontawesome-svg-core';

import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faPinterestP } from '@fortawesome/free-brands-svg-icons/faPinterestP';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';


const icons = [
    faFacebookF, faTwitter, faPinterestP,
    faWhatsapp,   faEnvelope, faCheck, faLink
];

library.add(...icons);
