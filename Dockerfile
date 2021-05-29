FROM ruby:2.5.1 as rb
LABEL maintainer "Guillaume Briday <guillaumebriday@gmail.com>"

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
    nodejs \
    yarn \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY app/index.js ./
COPY . .
EXPOSE 8080
# CMD [ "npm", "start" ]

# FROM ruby:2.5.1 as rb
WORKDIR /functional_spec
COPY functional_spec/Gemfile* ./
# RUN bundle install
COPY functional_spec/fixtures ./fixtures
COPY functional_spec/spec ./spec
COPY functional_spec/tmp ./tmp
COPY functional_spec/.rspec ./
COPY functional_spec/Rakefile ./

# FROM nd as dev
COPY bin ../bin
RUN chmod a+x /bin/setup
RUN chmod a+x /bin/parking_lot
RUN chmod a+x /bin/run_functional_tests

# FROM rb as dev
COPY . .
CMD ruby bin/run_functional_tests 