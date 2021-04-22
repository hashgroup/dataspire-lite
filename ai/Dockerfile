# Download base image ubuntu 18.04
FROM ubuntu:18.04


# Add source code and saved file
ENV HOME /root
ENV PYTHONPATH "/usr/lib/python3/dist-packages:/usr/local/lib/python3.6/site-packages"

RUN apt-get update -y && apt-get install -y python3 \
        python3-pip \
        build-essential
CMD python3 --version
RUN pip3 install pandas
RUN pip3 install requests
RUN pip3 install flask
RUN pip3 install numpy
RUN pip3 install lxml
RUN pip3 install gunicorn
RUN pip3 install gevent
RUN pip3 install scikit-learn
RUN pip3 install featuretools
RUN pip3 install fuzzymatcher
RUN pip3 install cmake
RUN pip3 install xgboost
# COPY SourceCode /app

# WORKDIR /app

# # CMD pip3 freeze


# CMD ls
#copy app
COPY . /ai
WORKDIR /
RUN chmod -x /ai/app.py

CMD ["gunicorn", "--workers", "3", "--worker-class", "gthread ", "--threads", "3", "-b", ":5000", "-t", "900", "--reload", "ai.wsgi:app"]

#docker stop $(docker ps -a -q)