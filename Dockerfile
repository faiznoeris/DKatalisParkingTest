FROM node:12 as nd
WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY app/index.js ./
COPY . .
EXPOSE 8080
# CMD [ "npm", "start" ]

FROM ruby:2.5.1 as rb
WORKDIR /functional_spec
COPY functional_spec/Gemfile* ./
RUN bundle install
COPY functional_spec/fixtures ./fixtures
COPY functional_spec/spec ./spec
COPY functional_spec/tmp ./tmp
COPY functional_spec/.rspec ./
COPY functional_spec/Rakefile ./

FROM nd as dev
COPY bin ../bin
RUN chmod a+x /bin/setup
RUN chmod a+x /bin/parking_lot
RUN chmod a+x /bin/run_functional_tests
RUN bin/parking_lot
# CMD ["bash", "bin/parking_lot"]

FROM rb as dev2
COPY . .
CMD ruby bin/run_functional_tests 